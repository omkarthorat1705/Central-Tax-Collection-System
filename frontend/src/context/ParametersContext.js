import React, { createContext, useContext, useState, useCallback } from "react";

import API from "../api/api";

const ParametersContext = createContext();

export const ParametersProvider = ({ children }) => {
  const [parameters, setParameters] = useState([]);

  const loadParameters = useCallback(async () => {
    try {
      const response = await API.get("/getParameters");

      setParameters(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <ParametersContext.Provider
      value={{
        parameters,
        loadParameters,
      }}
    >
      {children}
    </ParametersContext.Provider>
  );
};

export const useParametersContext = () => useContext(ParametersContext);
