/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "../services/api";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const res = await api.post("/user/login", { email, password });

      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message);
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const res = await api.post("/user/register", { name, email, password });
      return res.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },

  getCurrentUser: async () => {
    try {
      const res = await api.get("/user/me");
      return res.data.user;
    } catch (error) {
      return null;
    }
  },

  logout: async () => {
    try {
      const res = await api.post("/user/logout");
      return res.data;
    } catch (error: any) {
      throw new Error("Logout failed");
    }
  },
};
