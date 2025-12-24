// middlewares/roleMiddleware.js

import { apiError } from "../utils/apiError.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new apiError(403, "You are not authorized to access this resource");
    }
    next();
  };
};
