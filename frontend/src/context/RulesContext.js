import React, { createContext, useContext, useState, useCallback } from "react";

import API from "../api/api";

const RulesContext = createContext();

export const RulesProvider = ({ children }) => {
  const [rules, setRules] = useState([]);

  const loadRules = useCallback(async () => {
    try {
      const response = await API.get("/getRules");

      setRules(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <RulesContext.Provider
      value={{
        rules,
        loadRules,
      }}
    >
      {children}
    </RulesContext.Provider>
  );
};

export const useRulesContext = () => useContext(RulesContext);
