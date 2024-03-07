// import required modules
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const jwtValidation = async (req, res, next) => {
  const token = req.header("Authorization")
    ? req.header("Authorization").split(" ")[1]
    : null;

  // check if not token
  if (!token) {
    return res
      .status(401)
      .json({ status: "failed", message: "Unauthorized: Missing Token" });
  }

  // verify the token
  jwt.verify(
    token,
    "your-secret-key",
    { ignoreExpiration: false },
    (error, user) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({
            status: "failed",
            message: "Unauthorized: Token has expired",
          });
        } else {
          return res.status(403).json({
            status: "failed",
            message: "Forbidden : Invalid token",
          });
        }
      }

      if (user && mongoose.Types.ObjectId.isValid(user.userId)) {
        // attach userId to request object for later use
        req.userId = user.userId;

        //Continue to next middleware or route handler
        next();
      } else {
        return res.status(403).json({
          status: "failed",
          message: "Forbidden: Invalid token payload",
        });
      }
    }
  );
};

module.exports = jwtValidation;
