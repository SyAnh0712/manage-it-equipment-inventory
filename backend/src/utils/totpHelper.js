const crypto = require("crypto");
const OTPAuth = require("otpauth");
const QRCode = require("qrcode");

const generateTotpSecret = (email) => {
  const secret = new OTPAuth.Secret();
  const totp = new OTPAuth.TOTP({
    issuer: "IT Equipment Management",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  });

  return { secret: secret.base32, uri: totp.toString() };
};

const generateQrCodeUrl = async (uri) => {
  return QRCode.toDataURL(uri);
};

const verifyTotpToken = (secretBase32, token) => {
  const totp = new OTPAuth.TOTP({
    issuer: "IT Equipment Management",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  });

  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
};

const generateRecoveryCodes = (count = 8) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    codes.push(code);
  }
  return codes;
};

const ENCRYPTION_KEY = process.env.TWO_FACTOR_ENCRYPTION_KEY || "default-key-change-in-production!";

const encryptSecret = (text) => {
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

const decryptSecret = (encryptedText) => {
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const hashRecoveryCode = (code) => {
  return crypto.createHash("sha256").update(code).digest("hex");
};

module.exports = {
  generateTotpSecret,
  generateQrCodeUrl,
  verifyTotpToken,
  generateRecoveryCodes,
  encryptSecret,
  decryptSecret,
  hashRecoveryCode,
};
