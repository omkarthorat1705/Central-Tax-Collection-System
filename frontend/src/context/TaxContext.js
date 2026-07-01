import React, { createContext, useContext, useState, useCallback } from "react";

import API from "../api/api";

const TaxContext = createContext();

export const TaxProvider = ({ children }) => {
  const [taxTypes, setTaxTypes] = useState([]);

  const loadTaxTypes = useCallback(async () => {
    try {
      const response = await API.get("/getTaxTypes");

      setTaxTypes(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <TaxContext.Provider
      value={{
        taxTypes,
        loadTaxTypes,
      }}
    >
      {children}
    </TaxContext.Provider>
  );
};

export const useTaxContext = () => useContext(TaxContext);
