import { db } from "../index.js";
import { usersTable, usersPendingTable } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import otpGenerator from "otp-generator";
import { sendVerificationEmail } from "../../services/email.js";
import { generateEmailTemplate } from "../utils/emailTemplates.js";

const isProd = process.env.NODE_ENV === "production";
const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "Lax",
  path: "/",
};

export const register = async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  try {
    // 1. Check if user already exists in the FINAL users table
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists and is verified." });
    }

    const verificationCode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Use Upsert (onConflictDoUpdate) so if they register again within 24h,
    // we just update their pending record instead of throwing an error.
    await db
      .insert(usersPendingTable)
      .values({
        email,
        password: hashedPassword,
        full_name,
        phone,
        otp_verification_code: verificationCode,
        otp_expires_at: expires,
      })
      .onConflictDoUpdate({
        target: usersPendingTable.email,
        set: {
          password: hashedPassword,
          full_name,
          phone,
          otp_verification_code: verificationCode,
          otp_expires_at: expires,
          updated_at: new Date(),
        },
      });

    // 3. Send Email (Code omitted for brevity, same as yours)
    try {
      await sendVerificationEmail(
        email,
        "Verify your email",
        generateEmailTemplate(full_name, verificationCode)
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Continue anyway - user can still verify via OTP even if email fails
    }

    return res
      .status(201)
      .json({ message: "OTP sent to email. Please verify." });
  } catch (error) {
    console.error("Registration error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { code, email } = req.query;

  try {
    // 1. Find user in the PENDING table
    const [pendingUser] = await db
      .select()
      .from(usersPendingTable)
      .where(eq(usersPendingTable.email, email));

    if (!pendingUser) {
      return res
        .status(400)
        .json({ message: "No pending registration found." });
    }

    // 2. Check code and expiry
    const isExpired = new Date() > pendingUser.otp_expires_at;
    if (pendingUser.otp_verification_code !== code || isExpired) {
      return res.status(400).json({ message: "Invalid or expired code." });
    }

    let newUser;

    // 3. Move data using a Transaction
    await db.transaction(async (tx) => {
      // Insert into final users table
      const [insertedUser] = await tx
        .insert(usersTable)
        .values({
          email: pendingUser.email,
          password: pendingUser.password,
          full_name: pendingUser.full_name,
          phone: pendingUser.phone,
          email_verified: true,
        })
        .returning(); // Get the new user ID and Role

      newUser = insertedUser;

      // Delete from pending table
      await tx
        .delete(usersPendingTable)
        .where(eq(usersPendingTable.email, email));
    });

    // --- AUTOMATIC LOGIN LOGIC ---

    // 4. Generate JWT token
    const payload = { id: newUser.id, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 5. Set the Cookie
    res.cookie("token", token, {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // 6. Final Success Response
    return res.status(200).json({
      message: "Email verified and logged in successfully!",
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        role: newUser.role,
        is_active: true,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error during verification." });
  }
};

export const resendVerificationCode = async (req, res) => {
  const { email } = req.query;

  try {
    const [pendingUser] = await db
      .select()
      .from(usersPendingTable)
      .where(eq(usersPendingTable.email, email));

    if (!pendingUser) {
      return res
        .status(400)
        .json({ message: "No pending registration found." });
    }

    const newCode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    await db
      .update(usersPendingTable)
      .set({
        otp_verification_code: newCode,
        otp_expires_at: expires,
        updated_at: new Date(),
      })
      .where(eq(usersPendingTable.email, email));

    await sendVerificationEmail(
      email,
      "New Verification Code",
      generateEmailTemplate(pendingUser.full_name, newCode)
    );

    return res.status(200).json({ message: "New code sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    // Security tip: Use the same message for "user not found" and "wrong password"
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    // 2. Check if the account is active (Important for your schema)
    if (!user.is_active) {
      return res
        .status(403)
        .json({ message: "Account is deactivated. Please contact support." });
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    // 4. Generate JWT token
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d", // 1 week
    });

    // 5. SET HTTP-ONLY COOKIE
    // This hides the token from JavaScript (XSS Protection)
    res.cookie("token", token, {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // 6. Return user data (but NOT the token)
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // 1. Clear the cookie named 'token'
    res.clearCookie("token", {
      ...baseCookieOptions,
    });

    // 2. Return success message
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find user by ID
    const [user] = await db
      .select({
        full_name: usersTable.full_name,
        email: usersTable.email,
        phone: usersTable.phone,
        role: usersTable.role,
        email_verified: usersTable.email_verified,
        created_at: usersTable.created_at,
        is_active: usersTable.is_active,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { full_name, phone } = req.body;

  try {
    // 1. Update and use .returning() to get the updated row back immediately
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        full_name,
        phone,
        updated_at: new Date(), // Assuming you have this column in your schema
      })
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        full_name: usersTable.full_name,
        phone: usersTable.phone,
        email: usersTable.email,
      });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // 1. Find user by ID
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // 3. Security Check: Is the new password the same as the old one?
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: "New password cannot be the same as the old one" });
    }

    // 4. Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update password in DB
    await db
      .update(usersTable)
      .set({
        password: hashedNewPassword,
        updated_at: new Date(),
      })
      .where(eq(usersTable.id, userId));

    // 6. LOGOUT (Optional but Recommended for Security)
    // This forces the user to log in again with the new password
    res.clearCookie("token", {
      ...baseCookieOptions,
    });

    return res.status(200).json({
      message:
        "Password changed successfully. Please log in with your new password.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
