import { db, usersTable } from "../index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import otpGenerator from "otp-generator";
import { sendVerificationEmail } from "../../services/email.js";

export const register = async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  try {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP verification code
    // Digits-only OTP (no letters/symbols)
    const verificationCode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Set OTP expiry time (5 minutes)
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = {
      email,
      password: hashedPassword,
      full_name,
      phone,
      otp_verification_code: verificationCode,
      otp_expires_at: expires,
    };

    // Insert user into database
    await db.insert(usersTable).values(newUser);

    // Prepare verification email
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; padding: 0 4px;">
          <h2 style="margin: 0 0 12px 0; color: #111827;">Verify your email</h2>
          <p style="margin: 0 0 10px 0;">Hi ${full_name || "there"},</p>
          <p style="margin: 0 0 12px 0;">Use the one-time code below to verify your ClaimPoint account:</p>
          <p style="font-size: 22px; font-weight: 800; letter-spacing: 3px; margin: 12px 0 16px 0; color: #111827;">${verificationCode}</p>
          <p style="margin: 0 0 10px 0;">This code expires in <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
          <p style="margin: 0 0 10px 0;">If you did not request this, you can safely ignore this email.</p>
          <p style="margin: 16px 0 0 0; font-size: 12px; color: #6b7280;">Questions? Contact support at support@claimpoint.com.</p>
        </body>
      </html>
    `;

    const emailSubject = "Verify your email address";

    // Send verification email
    await sendVerificationEmail(email, emailSubject, emailBody);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { code, email } = req.query;

  try {
    // Find user by email
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
            <h2 style="color: #b91c1c; margin: 0 0 12px 0;">Verification failed</h2>
            <p style="margin: 0 0 12px 0;">We could not find that email. Please request a new code and try again.</p>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">If this keeps happening, contact support.</p>
          </body>
        </html>
      `);
    }

    // Check if code matches and is not expired
    if (
      user.otp_verification_code !== code ||
      new Date() > user.otp_expires_at
    ) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
            <h2 style="color: #b91c1c; margin: 0 0 12px 0;">Invalid or expired code</h2>
            <p style="margin: 0 0 12px 0;">Your verification link or code is invalid or has expired.</p>
            <p style="margin: 0 0 16px 0;">Please request a new code and try again.</p>
            <p style="margin: 0 0 16px 0;">
              <a href="http://localhost:${process.env.PORT}/api/auth/resend-verification-code?email=${email}" style="color: #2563eb; text-decoration: none;">
                Request a new code
              </a>
            </p>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">Code validity: 5 minutes from the time it was sent.</p>
          </body>
        </html>
      `);
    }

    // Update user to set email as verified
    await db
      .update(usersTable)
      .set({
        email_verified: true,
        otp_verification_code: null,
        otp_expires_at: null,
      })
      .where(eq(usersTable.id, user.id));

    return res.status(200).send(`
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
          <h2 style="color: #15803d; margin: 0 0 12px 0;">Email verified successfully</h2>
          <p style="margin: 0 0 12px 0;">Your email has been verified. You can now log in.</p>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">You may close this window.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resendVerificationCode = async (req, res) => {
  const { email } = req.query;

  try {
    // Find user by email
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate new OTP verification code
    const newCode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Set new OTP expiry time (5 minutes)
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    // Update user with new OTP code and expiry
    await db
      .update(usersTable)
      .set({
        otp_verification_code: newCode,
        otp_expires_at: expires,
      })
      .where(eq(usersTable.id, user.id));

    // Prepare verification email
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; padding: 0 4px;">
          <h2 style="margin: 0 0 12px 0; color: #111827;">Your new verification code</h2>
          <p style="margin: 0 0 10px 0;">Hi ${user.full_name || "there"},</p>
          <p style="margin: 0 0 12px 0;">Use this one-time code to verify your ClaimPoint account:</p>
          <p style="font-size: 22px; font-weight: 800; letter-spacing: 3px; margin: 12px 0 16px 0; color: #111827;">${newCode}</p>
          <p style="margin: 0 0 10px 0;">This code expires in <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
          <p style="margin: 0 0 10px 0;">If you did not request this, you can ignore this email.</p>
          <p style="margin: 16px 0 0 0; font-size: 12px; color: #6b7280;">Need help? Contact support at support@claimpoint.com.</p>
        </body>
      </html>
    `;

    const emailSubject = "Resend: Verify your email address";

    // Send verification email
    await sendVerificationEmail(email, emailSubject, emailBody);

    return res.status(200).send(`
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
          <h2 style="color: #15803d; margin: 0 0 12px 0;">New code sent</h2>
          <p style="margin: 0 0 12px 0;">A new verification code has been emailed to ${email}.</p>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">Check your inbox (and spam) and use the latest code within 5 minutes.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Resend verification code error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id, role: user.role };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1 week",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find user by ID
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude sensitive fields
    const { password, otp_verification_code, otp_expires_at, ...userProfile } =
      user;

    return res.status(200).json({ user: userProfile });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
