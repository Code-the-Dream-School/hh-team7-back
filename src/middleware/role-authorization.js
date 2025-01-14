const User = require("../models/user");

const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      next({ statusCode: 403, message: "Access denied" });
    }
    next();
  };
};

const verifyRoleInDB = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        next({ statusCode: 404, message: "User not found" });
      }
      console.log("user.role",user.role);
      if (!allowedRoles.includes(user.role)) {
        next({ statusCode: 403, message: "Access denied" });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authorizeRoles, verifyRoleInDB };
