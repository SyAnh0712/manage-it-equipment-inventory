const nodemailer = require("nodemailer");

const mailHost = process.env.MAIL_HOST || "smtp.gmail.com";
const isGmail = mailHost.includes("gmail.com");

const transporter = nodemailer.createTransport(
  isGmail
    ? {
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      }
    : {
        host: mailHost,
        port: parseInt(process.env.MAIL_PORT || "587"),
        secure: process.env.MAIL_SECURE === "true" || parseInt(process.env.MAIL_PORT || "587") === 465,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      }
);

const sendOtpEmail = async (email, otp) => {
  const expiresMinutes = process.env.OTP_EXPIRES_MINUTES || 5;

  const mailOptions = {
    from: `"IT Equipment System" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Mã xác minh email - IT Equipment Management",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Xác minh địa chỉ email</h2>
        <p style="color: #555;">Mã OTP của bạn là:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 14px;">Mã này sẽ hết hạn sau ${expiresMinutes} phút.</p>
        <p style="color: #888; font-size: 14px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
      </div>
    `,
  };

  if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return;
  }

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
