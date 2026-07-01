import React, { createContext, useContext, useState, useCallback } from "react";

import API from "../api/api";

const CitizensContext = createContext();

export const CitizensProvider = ({ children }) => {
  const [citizens, setCitizens] = useState([]);

  const loadCitizens = useCallback(async () => {
    try {
      const response = await API.get("/getCitizens");

      setCitizens(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <CitizensContext.Provider
      value={{
        citizens,
        loadCitizens,
      }}
    >
      {children}
    </CitizensContext.Provider>
  );
};

export const useCitizensContext = () => useContext(CitizensContext);
