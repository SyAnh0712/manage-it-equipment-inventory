const crypto = require("crypto");

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

const isOtpExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

module.exports = { generateOtp, hashOtp, isOtpExpired };
