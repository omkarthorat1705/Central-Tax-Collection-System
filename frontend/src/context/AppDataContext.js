import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import API from "../api/api";

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [dashboardSummary, setDashboardSummary] = useState({
    total_assessment: 0,
    total_collection: 0,
    total_pending: 0,
    partial_cases: 0,
  });
  const [taxTypes, setTaxTypes] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshDashboard = useCallback(async () => {
    try {
      const response = await API.get("/getRevenueSummary");
      setDashboardSummary(response.data.data || {});
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshTaxTypes = useCallback(async () => {
    try {
      const response = await API.get("/getTaxTypes");
      setTaxTypes(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshCitizens = useCallback(async () => {
    try {
      const response = await API.get("/getCitizens");
      setCitizens(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([refreshDashboard(), refreshTaxTypes(), refreshCitizens()]);
    setLoading(false);
  }, [refreshDashboard, refreshTaxTypes, refreshCitizens]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <AppDataContext.Provider
      value={{
        dashboardSummary,
        refreshDashboard,
        taxTypes,
        refreshTaxTypes,
        citizens,
        refreshCitizens,
        refreshAll,
        loading,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
