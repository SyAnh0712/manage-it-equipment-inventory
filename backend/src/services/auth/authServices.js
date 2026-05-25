const db = require("../../models");

const { comparePassword } = require("../../utils/passwordHelper");

const { generateAccessToken } = require("../../utils/tokenHelper");

const { hashPassword } = require("../../utils/passwordHelper");

const loginService = async (data) => {
  const user = await db.User.findOne({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const isMatch = await comparePassword(data.password, user.password);
  console.log("Password match:", isMatch);
  if (!isMatch) {
    throw new Error("Mật khẩu không đúng");
  }

  const token = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,

    user: {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    },
  };
};

const registerService = async (data) => {
  const existingUser = await db.User.findOne({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  const existingUsername = await db.User.findOne({
    where: {
      username: data.username,
    },
  });

  if (existingUsername) {
    throw new Error("Username đã tồn tại");
  }

  const hashedPassword = await hashPassword(data.password);

  const newUser = await db.User.create({
    username: data.username,

    full_name: data.full_name,

    email: data.email,

    password: hashedPassword,

    role: "staff",
  });

  const token = generateAccessToken({
    id: newUser.id,

    username: newUser.username,

    role: newUser.role,
  });

  return {
    token,

    user: {
      id: newUser.id,

      username: newUser.username,

      full_name: newUser.full_name,

      email: newUser.email,

      role: newUser.role,
    },
  };
};
module.exports = {
  loginService,
  registerService,
};
