export const authorizeRoles = (...allowedRoleIds) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
          errorCode: "UNAUTHORIZED",
          timestamp: new Date().toISOString(),
        });
      }

      if (!allowedRoleIds.includes(req.user.role_id)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions for this resource",
          errorCode: "FORBIDDEN",
          timestamp: new Date().toISOString(),
        });
      }

      next();
    } catch (error) {
      console.error("Role authorization notice:", error.message);

      return res.status(403).json({
        success: false,
        message: "Authorization check failed",
        errorCode: "FORBIDDEN",
        timestamp: new Date().toISOString(),
      });
    }
  };
};
