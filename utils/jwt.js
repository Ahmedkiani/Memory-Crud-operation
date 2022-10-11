const accessEnv = require("./access-env.js");
const jwt = require("jsonwebtoken");

const createAccessToken = (payload) => {
  return jwt.sign(payload, accessEnv("JWT_ACCESS_SECRET"), {
    expiresIn: accessEnv("JWT_ACCESS_SECRET_EXPIRE"),
  });
};
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, accessEnv("JWT_ACCESS_SECRET"));
    return decoded;
  } catch (error) {
    return { message: "Cannot verify refresh token." };
  }
};
module.exports = { createAccessToken, verifyAccessToken };
