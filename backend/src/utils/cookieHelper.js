const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

const setAuthCookie = (res, token) => {
  res.cookie("access_token", token, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
};

const setRefreshCookie = (res, token) => {
  res.cookie("refresh_token", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie("access_token", cookieOptions);
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refresh_token", cookieOptions);
};

module.exports = {
  setAuthCookie,
  setRefreshCookie,
  clearAuthCookie,
  clearRefreshCookie,
};
