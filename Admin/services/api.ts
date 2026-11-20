import axios from "axios";
import Constants from "expo-constants";

const API_PORT = 5000;

// Mengambil IP laptop dari alamat Expo development server
const EXPO_HOST = Constants.expoConfig?.hostUri;
const HOST_IP = EXPO_HOST?.split(":")[0];

// Development: gunakan IP laptop secara otomatis.
// Production: gunakan alamat API dari environment.
const API_URL =
  __DEV__ && HOST_IP
    ? `http://${HOST_IP}:${API_PORT}`
    : process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL ? `${API_URL.replace(/\/$/, "")}/api` : undefined,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});


// API CONNECTION DIAGNOSTIC
api.interceptors.request.use(
  (config) => {
    console.log("[GRS API] REQUEST:", {
      method: config.method?.toUpperCase(),
      target: `${config.baseURL}${config.url}`,
    });

    return config;
  },
  (error) => {
    console.error("[GRS API] REQUEST ERROR:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log("[GRS API] SUCCESS:", response.status);
    return response;
  },
  (error) => {
    console.error("[GRS API] FAILED:", {
      message: error.message,
      code: error.code,
      target: `${error.config?.baseURL ?? "NO_BASE_URL"}${error.config?.url ?? ""}`,
      status: error.response?.status ?? "NO_RESPONSE",
      response: error.response?.data ?? null,
    });

    return Promise.reject(error);
  },
);

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

export type AdminAccount = {
  _id: string;
  username: string;
  email: string;
  role: "admin";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

console.log("EXPO API URL:", API_URL);
console.log("AXIOS BASE URL:", api.defaults.baseURL);

function ensureApiUrl() {
  if (!API_URL) {
    throw new Error("Alamat API belum diatur. Periksa EXPO_PUBLIC_API_URL.");
  }
}


function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const target = `${error.config?.baseURL ?? API_URL ?? "Tidak diketahui"}${error.config?.url ?? ""}`;

    // Server memberikan respons HTTP
    if (error.response) {
      const serverMessage = error.response.data?.message;

      return (
        serverMessage ||
        `Server merespons dengan HTTP ${error.response.status}.`
      );
    }

    // Timeout
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return `Koneksi timeout setelah 15 detik.\nAlamat: ${target}`;
    }

    // Alamat API kosong
    if (!error.config?.baseURL) {
      return "Alamat API tidak ditemukan. Periksa EXPO_PUBLIC_API_URL.";
    }

    // Gangguan jaringan / IP / HTTP Android
    if (error.code === "ERR_NETWORK") {
      return `Network Error.\nAlamat tujuan: ${target}\nPeriksa IP komputer, koneksi Wi-Fi, dan izin HTTP Android.`;
    }

    // Error koneksi lainnya
    return `Koneksi API gagal.\nAlamat: ${target}\nKode: ${error.code ?? "Tidak tersedia"}\nDetail: ${error.message}`;
  }

  console.error("[GRS API] UNKNOWN ERROR:", error);

  return error instanceof Error
    ? error.message
    : "Terjadi kesalahan yang tidak diketahui.";
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

  async login(identifier: string, password: string): Promise<AuthResponse> {
    ensureApiUrl();

    try {
      const response = await api.post("/auth/login", {
        identifier,
        password,
      });

      return response.data;
    } catch (error) {
      throw new Error(getApiError(error));
    }
  },
};

export const superAdminApi = {
  async getAdmins(token: string): Promise<{ users: AdminAccount[] }> {
    ensureApiUrl();

    try {
      const response = await api.get("/superadmin/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(getApiError(error));
    }
  },

  async updateStatus(
    id: string,
    status: "approved" | "rejected",
    token: string,
  ) {
    ensureApiUrl();

    try {
      const response = await api.patch(
        `/superadmin/registrations/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(getApiError(error));
    }
  },

  async deleteAdmin(id: string, token: string) {
    ensureApiUrl();

    try {
      const response = await api.delete(`/superadmin/admins/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(getApiError(error));
    }
  },
};

export type AdminProfile = {
  username: string;
  email: string;
  fullName: string;
  location: string;
  education: string;
  monitoring: string;
  dailyFeedback: string;
  crudCount: string;
};

export type TransactionItem = {
  _id: string;
  reference: string;
  userName: string;
  userEmail: string;
  paymentMethod: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "refunded";
  transactionDate: string;
};

export const adminApi = {
  async getProfile(token: string) {
    ensureApiUrl();

    try {
      const response = await api.get("/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data as { profile: AdminProfile };
    } catch (error) {
      throw new Error(getApiError(error));
    }
  },

  async updateProfile(payload: Partial<AdminProfile>, token: string) {
    ensureApiUrl();

    try {
      const response = await api.patch("/admin/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data as { profile: AdminProfile };
    } catch (error) {
      throw new Error(getApiError(error));
    }
  },

  async getTransactions(
    params: {
      period: "7d" | "30d" | "all";
      search: string;
      page: number;
      limit: number;
    },
    token: string,
  ) {
    ensureApiUrl();

    try {
      const response = await api.get("/admin/transactions", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data as {
        transactions: TransactionItem[];
        total: number;
        page: number;
        totalPages: number;
        summary: {
          totalTransactions: number;
          totalAmount: number;
          previousAmount: number;
          growth: number;
        };
      };
    } catch (error) {
      throw new Error(getApiError(error));
    }
  },
};
