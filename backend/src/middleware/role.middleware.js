export const authorizeRoles = (...allowedRoleIds) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      console.log("========== ROLE DEBUG ==========");
      console.log("User Role ID:", req.user.role_id);
      console.log("Allowed Role IDs:", allowedRoleIds);

      if (!allowedRoleIds.includes(req.user.role_id)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};
