const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const header = req.get("Authorization");
    if (!header) {
      const error = new Error("do not have authorization header");
      error.statusCode = 401;
      next(error);
    }
    const token = req.get("Authorization").split(" ")[1];
    let decodedToken;
    if (!token) {
      const error = new Error("Invalid authorization token");
      error.statusCode = 401;
      next(error);
    }
    decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken) {
      const error = new Error(`Invalid authorization token: ${token}`);
      error.statusCode = 401;
      next(error);
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};