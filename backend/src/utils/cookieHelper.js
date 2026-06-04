const setAuthCookie = (res, token) => {
  const maxAge = 7 * 24 * 60 * 60 * 1000;

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

module.exports = { setAuthCookie, clearAuthCookie };
