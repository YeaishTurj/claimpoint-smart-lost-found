const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = {
  // Auth endpoints
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");
    return data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    return data;
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch profile");
    return data;
  },

  verifyEmail: async (code, email) => {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/verify-email?code=${code}&email=${email}`,
      { method: "GET" }
    );
    if (!response.ok) throw new Error("Email verification failed");
    return response.text();
  },

  resendVerificationCode: async (email) => {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/resend-verification-code?email=${email}`,
      { method: "GET" }
    );
    if (!response.ok) throw new Error("Failed to resend verification code");
    return response.text();
  },

  // Item endpoints
  getAllFoundItems: async (token = null) => {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/items/found-items`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch items");
    return data;
  },

  getFoundItemById: async (id, token = null) => {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(
      `${API_BASE_URL}/api/items/found-items/${id}`,
      {
        method: "GET",
        headers,
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch item");
    return data;
  },

  // Admin endpoints
  createFoundItem: async (itemData, token) => {
    const response = await fetch(`${API_BASE_URL}/api/staff/found-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create item");
    return data;
  },

  recordFoundItem: async (token, itemData) => {
    const response = await fetch(`${API_BASE_URL}/api/staff/add-found-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to record item");
    return data;
  },

  reportLostItem: async (token, itemData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/report-lost-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to report lost item");
    return data;
  },

  getUserLostReports: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/user/lost-reports`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch lost reports");
    return data;
  },

  updateUserLostReport: async (token, reportId, updateData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/user/lost-reports/${reportId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to update lost report");
    return data;
  },

  getLostReportById: async (id, token = null) => {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/items/lost-reports/${id}`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch lost report");
    return data;
  },

  // Admin endpoints
  addStaff: async (staffData, token) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/add-staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(staffData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to add staff");
    return data;
  },
};

export default api;
