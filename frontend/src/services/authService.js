import axiosClient from "./axiosClient";

const authService = {
  login(credentials) {
    return axiosClient.post("/auth/login", credentials);
  },

  register(data) {
    return axiosClient.post("/auth/register", data);
  },

  verifyOtp(email, otp) {
    return axiosClient.post("/auth/verify-otp", { email, otp });
  },

  resendOtp(email) {
    return axiosClient.post("/auth/resend-otp", { email });
  },

  verify2fa(tempToken, code) {
    return axiosClient.post("/auth/verify-2fa", { tempToken, code });
  },

  setup2fa() {
    return axiosClient.post("/auth/setup-2fa");
  },

  confirm2faSetup(code, secret) {
    return axiosClient.post("/auth/confirm-2fa-setup", { code, secret });
  },

  disable2fa(password) {
    return axiosClient.post("/auth/disable-2fa", { password });
  },

  logout() {
    return axiosClient.post("/auth/logout");
  },

  getMe() {
    return axiosClient.get("/auth/me", { skipAuthRedirect: true });
  },
};

export default authService;
