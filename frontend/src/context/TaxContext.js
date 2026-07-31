import { createContext, useCallback, useContext, useState } from "react";

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

  const addTaxType = useCallback(async (payload) => {
    const response = await API.post("/addTaxType", payload);
    return response.data.data;
  }, []);

  const deleteTaxType = useCallback(async (id) => {
    const response = await API.delete(`/deleteTaxType/${id}`);
    return response.data.data;
  }, []);

  return (
    <TaxContext.Provider
      value={{
        taxTypes,
        loadTaxTypes,
        addTaxType,
        deleteTaxType,
      }}
    >
      {children}
    </TaxContext.Provider>
  );
};

export const useTaxContext = () => useContext(TaxContext);
