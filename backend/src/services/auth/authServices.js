const db = require("../../models");
const { comparePassword, hashPassword } = require("../../utils/passwordHelper");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/tokenHelper");
const { generateOtp, hashOtp, isOtpExpired } = require("../../utils/otpHelper");
const { sendOtpEmail } = require("../../utils/emailHelper");
const {
  generateTotpSecret,
  generateQrCodeUrl,
  verifyTotpToken,
  generateRecoveryCodes,
  encryptSecret,
  decryptSecret,
  hashRecoveryCode,
} = require("../../utils/totpHelper");
const jwt = require("jsonwebtoken");
const { accessTokenSecret, refreshTokenSecret } = require("../../config/jwt");

const loginService = async (data) => {
  const user = await db.User.findOne({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) {
    throw new Error("Mật khẩu không đúng");
  }

  if (user.is_locked) {
    throw new Error("Tài khoản đã bị khóa");
  }

  if (user.role === "admin" && user.two_factor_enabled) {
    const tempToken = jwt.sign(
      { id: user.id, purpose: "2fa" },
      accessTokenSecret,
      { expiresIn: "5m" },
    );

    return { requires2FA: true, tempToken };
  }

  const token = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
};

const registerService = async (data) => {
  const existingUser = await db.User.findOne({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  const existingUsername = await db.User.findOne({
    where: { username: data.username },
  });

  if (existingUsername) {
    throw new Error("Username đã tồn tại");
  }

  const hashedPassword = await hashPassword(data.password);
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const otpExpiresMinutes = Number.parseInt(
    process.env.OTP_EXPIRES_MINUTES || "5",
    10,
  );
  const otpExpiresAt = new Date(Date.now() + otpExpiresMinutes * 60 * 1000);

  const existingPending = await db.PendingUser.findOne({
    where: { email: data.email },
  });

  if (existingPending) {
    await existingPending.update({
      username: data.username,
      full_name: data.full_name,
      password: hashedPassword,
      otp_hash: otpHash,
      otp_expires_at: otpExpiresAt,
    });
  } else {
    await db.PendingUser.create({
      username: data.username,
      full_name: data.full_name,
      email: data.email,
      password: hashedPassword,
      otp_hash: otpHash,
      otp_expires_at: otpExpiresAt,
    });
  }

  await sendOtpEmail(data.email, otp);

  const result = {
    message: "Mã OTP đã được gửi đến email của bạn",
    email: data.email,
  };

  if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    result.otp = otp;
    result.message = "Mã OTP của bạn (chế độ dev)";
  }

  return result;
};

const verifyOtpService = async (data) => {
  const { email, otp } = data;

  const pendingUser = await db.PendingUser.findOne({
    where: { email },
  });

  if (!pendingUser) {
    throw new Error("Không tìm thấy yêu cầu đăng ký cho email này");
  }

  if (isOtpExpired(pendingUser.otp_expires_at)) {
    throw new Error("Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại");
  }

  const inputHash = hashOtp(otp);
  if (inputHash !== pendingUser.otp_hash) {
    throw new Error("Mã OTP không hợp lệ");
  }

  const newUser = await db.sequelize.transaction(async (t) => {
    const user = await db.User.create(
      {
        username: pendingUser.username,
        full_name: pendingUser.full_name,
        email: pendingUser.email,
        password: pendingUser.password,
        role: "staff",
      },
      { transaction: t },
    );

    await pendingUser.destroy({ transaction: t });

    return user;
  });

  const token = generateAccessToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });
  const refreshToken = generateRefreshToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  return {
    token,
    refreshToken,
    user: {
      id: newUser.id,
      username: newUser.username,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
    },
  };
};

const resendOtpService = async (data) => {
  const { email } = data;

  const pendingUser = await db.PendingUser.findOne({
    where: { email },
  });

  if (!pendingUser) {
    throw new Error("Không tìm thấy yêu cầu đăng ký cho email này");
  }

  const lastSent = new Date(pendingUser.updated_at || pendingUser.created_at);
  const cooldown = 60 * 1000;
  if (Date.now() - lastSent.getTime() < cooldown) {
    throw new Error("Vui lòng đợi 60 giây trước khi gửi lại mã OTP");
  }

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const otpExpiresMinutes = Number.parseInt(
    process.env.OTP_EXPIRES_MINUTES || "5",
    10,
  );
  const otpExpiresAt = new Date(Date.now() + otpExpiresMinutes * 60 * 1000);

  await pendingUser.update({
    otp_hash: otpHash,
    otp_expires_at: otpExpiresAt,
  });

  await sendOtpEmail(email, otp);

  const result = { message: "Mã OTP mới đã được gửi đến email của bạn" };

  if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    result.otp = otp;
    result.message = "Mã OTP mới của bạn (chế độ dev)";
  }

  return result;
};

const verify2faService = async (data) => {
  const { tempToken, code } = data;

  let decoded;
  try {
    decoded = jwt.verify(tempToken, accessTokenSecret);
  } catch {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }

  if (decoded.purpose !== "2fa") {
    throw new Error("Token không hợp lệ");
  }

  const user = await db.User.findByPk(decoded.id);
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  const secret = decryptSecret(user.two_factor_secret);

  let isValid = verifyTotpToken(secret, code);

  if (!isValid && user.recovery_codes) {
    const recoveryCodes = JSON.parse(user.recovery_codes);
    const codeHash = hashRecoveryCode(code);
    const codeIndex = recoveryCodes.indexOf(codeHash);

    if (codeIndex !== -1) {
      isValid = true;
      recoveryCodes.splice(codeIndex, 1);
      await user.update({ recovery_codes: JSON.stringify(recoveryCodes) });
    }
  }

  if (!isValid) {
    throw new Error("Mã xác thực không hợp lệ");
  }

  const token = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
};

const setup2faService = async (userId) => {
  const user = await db.User.findByPk(userId);
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  if (user.two_factor_enabled) {
    throw new Error("2FA đã được bật trước đó");
  }

  const { secret, uri } = generateTotpSecret(user.email);
  const qrCode = await generateQrCodeUrl(uri);

  return { secret, qrCode };
};

const confirm2faSetupService = async (userId, data) => {
  const { code, secret } = data;

  const isValid = verifyTotpToken(secret, code);
  if (!isValid) {
    throw new Error("Mã xác thực không hợp lệ. Vui lòng thử lại");
  }

  const encryptedSecret = encryptSecret(secret);
  const recoveryCodes = generateRecoveryCodes();
  const hashedCodes = recoveryCodes.map(hashRecoveryCode);

  await db.User.update(
    {
      two_factor_enabled: true,
      two_factor_secret: encryptedSecret,
      recovery_codes: JSON.stringify(hashedCodes),
    },
    { where: { id: userId } },
  );

  return { recoveryCodes };
};

const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token không tồn tại");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, refreshTokenSecret);
  } catch {
    throw new Error("Refresh token không hợp lệ hoặc đã hết hạn");
  }

  const user = await db.User.findByPk(decoded.id);
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  if (user.is_locked) {
    throw new Error("Tài khoản đã bị khóa");
  }

  const token = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const newRefreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    refreshToken: newRefreshToken,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
};

const disable2faService = async (userId, data) => {
  const { password } = data;

  const user = await db.User.findByPk(userId);
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Mật khẩu không đúng");
  }

  await user.update({
    two_factor_enabled: false,
    two_factor_secret: null,
    recovery_codes: null,
  });
};

module.exports = {
  loginService,
  registerService,
  verifyOtpService,
  resendOtpService,
  verify2faService,
  setup2faService,
  confirm2faSetupService,
  refreshTokenService,
  disable2faService,
};
