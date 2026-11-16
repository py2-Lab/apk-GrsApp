import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL ? `${API_URL.replace(/\/$/, "")}/api` : undefined,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: "admin" | "superadmin";
    status: "approved";
  };
};

function ensureApiUrl() {
  if (!API_URL) {
    throw new Error("Alamat API belum diatur. Periksa EXPO_PUBLIC_API_URL.");
  }
}

function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.code === "ECONNABORTED") {
      return "Server terlalu lama merespons.";
    }

    if (!error.response) {
      return "Tidak dapat terhubung ke server. Periksa alamat API dan koneksi jaringan.";
    }
  }

  return "Terjadi kesalahan yang tidak diketahui.";
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<{ message: string }> {
    ensureApiUrl();

    try {
      const response = await api.post("/auth/register", payload);

      return response.data;
    } catch (error) {
      throw new Error(getApiError(error));
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    ensureApiUrl();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw new Error(getApiError(error));
    }
  },
};
