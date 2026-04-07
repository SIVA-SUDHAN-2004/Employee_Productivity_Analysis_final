import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from "react";
import {
  uploadCSVApi,
  getEmployeesApi,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
  deleteAllEmployeesApi,
  predictOneApi,
  predictManyApi
} from "../api/employeeApi.js";

const EmployeeContext = createContext(null);

export const EmployeeProvider = ({ children }) => {
  // The canonical list of employees shared across all pages
  const [employees, setEmployees] = useState([]);
  // Whether any async network action is currently in progress
  const [isLoading, setIsLoading] = useState(false);
  // Tracks if an upload has been performed this session
  const [hasUploaded, setHasUploaded] = useState(false);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const withLoading = useCallback(async (fn) => {
    setIsLoading(true);
    try {
      return await fn();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Load all employees from server (called on initial mount) ───────────────

  const loadEmployees = useCallback(async () => {
    return withLoading(async () => {
      try {
        const res = await getEmployeesApi();
        const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setEmployees(list);
        if (list.length > 0) setHasUploaded(true);
        return list;
      } catch (err) {
        console.error("Failed to load employees:", err);
        return [];
      }
    });
  }, [withLoading]);

  // Load once when context mounts (after auth is in place)
  useEffect(() => {
    const token = localStorage.getItem("ep_token");
    if (token) loadEmployees();
  }, [loadEmployees]);

  // Listen for logout events dispatched by AuthContext and flush all state.
  // Using a custom event avoids a circular provider dependency
  // (AuthProvider wraps EmployeeProvider, so AuthContext can't call useEmployee).
  useEffect(() => {
    const handleLogout = () => {
      setEmployees([]);
      setHasUploaded(false);
    };
    window.addEventListener("ep-logout", handleLogout);
    return () => window.removeEventListener("ep-logout", handleLogout);
  }, []);

  // ─── Upload CSV ──────────────────────────────────────────────────────────────

  const uploadCSV = useCallback(
    async (file) => {
      return withLoading(async () => {
        const res = await uploadCSVApi(file);
        // Server now returns { insertedCount, employees: [...all records] }
        const list = res.data.employees ?? [];
        setEmployees(list);
        setHasUploaded(true);
        return res.data;
      });
    },
    [withLoading]
  );

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  const createEmployee = useCallback(
    async (data) => {
      return withLoading(async () => {
        const res = await createEmployeeApi(data);
        setEmployees((prev) => [res.data, ...prev]);
        return res.data;
      });
    },
    [withLoading]
  );

  const updateEmployee = useCallback(
    async (id, data) => {
      return withLoading(async () => {
        const res = await updateEmployeeApi(id, data);
        setEmployees((prev) =>
          prev.map((e) => (e._id === id ? res.data : e))
        );
        return res.data;
      });
    },
    [withLoading]
  );

  const deleteEmployee = useCallback(
    async (id) => {
      return withLoading(async () => {
        await deleteEmployeeApi(id);
        setEmployees((prev) => prev.filter((e) => e._id !== id));
      });
    },
    [withLoading]
  );

  // ─── Prediction ──────────────────────────────────────────────────────────────

  /**
   * Predict for a single employee by their MongoDB _id.
   * Updates only that one record in state.
   */
  const predictOne = useCallback(
    async (id) => {
      return withLoading(async () => {
        const res = await predictOneApi(id);
        setEmployees((prev) =>
          prev.map((e) => (e._id === id ? res.data : e))
        );
        return res.data;
      });
    },
    [withLoading]
  );

  /**
   * Predict for all (or a subset of) employees.
   * Pass an array of _id strings, or omit to predict for all.
   */
  const predictAll = useCallback(
    async (ids) => {
      return withLoading(async () => {
        const targetIds = ids ?? employees.map((e) => e._id);
        const res = await predictManyApi(targetIds);
        const updated = res.data; // array of updated employee docs
        const map = Object.fromEntries(updated.map((e) => [e._id, e]));
        setEmployees((prev) => prev.map((e) => map[e._id] ?? e));
        return updated;
      });
    },
    [withLoading, employees]
  );

  // ─── Clear all data from context AND database ───────────────────────

  const clearEmployees = useCallback(async () => {
    return withLoading(async () => {
      try {
        // Delete all records from MongoDB for this manager so the
        // data doesn't reappear on page refresh.
        await deleteAllEmployeesApi();
      } catch (err) {
        console.error("Failed to clear employees from DB:", err);
        // Still clear local state even if the API call fails
      } finally {
        setEmployees([]);
        setHasUploaded(false);
      }
    });
  }, [withLoading]);

  // ─── Context value ───────────────────────────────────────────────────────────

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        setEmployees,
        isLoading,
        hasUploaded,
        loadEmployees,
        uploadCSV,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        predictOne,
        predictAll,
        clearEmployees
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployee must be used within an EmployeeProvider");
  return ctx;
};
