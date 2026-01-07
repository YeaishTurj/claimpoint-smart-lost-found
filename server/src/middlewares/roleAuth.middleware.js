// Role hierarchy: ADMIN > STAFF > USER
const roleHierarchy = {
  ADMIN: 3,
  STAFF: 2,
  USER: 1,
};

/**
 * Authorization middleware that checks if user has required role.
 * ADMIN can access everything.
 * STAFF can only access STAFF routes.
 * USER can only access USER routes.
 */
export const roleAuthorization = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    console.log("User Role:", userRole);
    console.log("Allowed Roles:", allowedRoles);

    // ADMIN has access to everything
    if (userRole === "ADMIN") {
      return next();
    }

    // Check if user's role is in the allowed roles list
    if (allowedRoles.includes(userRole)) {
      // console.log("Access granted");
      return next();
    }
    // console.log("Access denied");
    return res.status(403).json({
      message: "Forbidden: You do not have permission to access this resource",
    });
  };
};

/**
 * Strict role authorization - user must have EXACTLY this role.
 * Use this when you want to prevent ADMIN from accessing certain routes.
 */
export const strictRoleAuthorization = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        message: "Forbidden: Insufficient role",
      });
    }
    next();
  };
};
