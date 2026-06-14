import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {server} from '../src/main'

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [families, setFamilies] = useState([]);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState(null);

  const API = axios.create({
    baseURL: `${server}/api/admin`,
  });

  // 🔐 Attach token to every request
  API.interceptors.request.use((req) => {
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  // =======================
  // 🔐 LOGIN
  // =======================
  const login = async (email, password) => {
    try {
      const { data } = await API.post("/login", { email, password });

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // =======================
  // 📝 REGISTER (optional)
  // =======================
  const register = async (form) => {
    try {
      await API.post("/register", form);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // =======================
  // 👨‍👩‍👧 CREATE FAMILY
  // =======================
  const createFamily = async (form) => {
    try {
      const { data } = await API.post("/family", form);
      setFamilies((prev) => [data, ...prev]);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // =======================
  // 📋 GET FAMILIES
  // =======================
  const fetchFamilies = async (search = "") => {
    try {
      const { data } = await API.get(`/families?search=${search}`);
      setFamilies(data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };
  // ✏️ UPDATE FAMILY
const updateFamily = async (id, form) => {
  try {
    const { data } = await API.put(`/family/${id}`, form);

    setFamilies((prev) =>
      prev.map((f) => (f._id === id ? data : f))
    );
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
  }
};

// ❌ DELETE FAMILY
const deleteFamily = async (id) => {
  try {
    await API.delete(`/family/${id}`);

    setFamilies((prev) => prev.filter((f) => f._id !== id));
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
  }
};
const getSettings = async () => {
  try {
    const { data } = await API.get("/settings");

    setSettings(data);

    return data;
  } catch (error) {
    console.error(
      error.response?.data?.message || error.message
    );
  }
};
const updateSettings = async (form) => {
  try {
    const { data } = await API.put(
      "/settings",
      form
    );

    setSettings(data);

    return data;
  } catch (error) {
    console.error(
      error.response?.data?.message || error.message
    );
  }
};

  // =======================
  // 🥛 CREATE DAILY ENTRY
  // =======================
  const createEntry = async (entry) => {
    try {
      await API.post("/entry", entry);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };
const getCalendar = async (familyId, month, year) => {
  try {
    const { data } = await API.get(
      `/history/calendar?familyId=${familyId}&month=${month}&year=${year}`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};
const generateInvoice = async (familyId, invoiceIndex = 0) => {
  try {
    const { data } = await API.post("/invoice/generate", {
      familyId,
      invoiceIndex,
    });

    return data;
  } catch (error) {
    console.error(
      error.response?.data?.message || error.message
    );
  }
};
// 🔥 Get invoices for a family
const getInvoicesByFamily = async (familyId) => {
  try {
    const { data } = await API.get(`/invoice/${familyId}`);
    return data;
  } catch (error) {
    console.error(error);
  }
};

// 🔥 Update status
const markInvoicePaid = async (invoiceId) => {
  try {
    await API.put(`/invoice/status/${invoiceId}`);
  } catch (error) {
    console.error(error);
  }
};

const getInvoiceDashboard = async (month, search = "") => {
  try {
    const { data } = await API.get(
      `/invoice/dashboard?month=${month}&search=${search}`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};
  // =======================
  // 📅 GET MONTHLY HISTORY
  // =======================
  const getHistory = async (familyId, month) => {
    try {
      const { data } = await API.get(
        `/history?familyId=${familyId}&month=${month}`
      );
      return data;
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // =======================
  // 📊 GET STATS
  // =======================
  const fetchStats = async () => {
    try {
      const { data } = await API.get("/stats");
      setStats(data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // =======================
  // 🚪 LOGOUT
  // =======================
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  // Auto load stats after login
useEffect(() => {
  if (token) {
    fetchStats();
    fetchFamilies();
    getSettings();
  }
}, [token]);

  return (
    <AdminContext.Provider
      value={{
        user,
        token,
        families,
        stats,
        login,
        register,
        logout,
        createFamily,
        fetchFamilies,
        createEntry,
        getHistory,
        fetchStats,
        deleteFamily,
        updateFamily,
        getCalendar,
        generateInvoice,
        getInvoiceDashboard,
        getInvoicesByFamily,
        markInvoicePaid,
        settings,
getSettings,
updateSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook
export const useAdmin = () => useContext(AdminContext);