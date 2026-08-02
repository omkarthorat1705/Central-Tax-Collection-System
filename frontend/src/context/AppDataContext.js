import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import assetService from "../services/assetService";
import { getCitizens } from "../services/citizenService";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [citizens, setCitizens] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [taxTypes, setTaxTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshCitizens = useCallback(async () => {
    try {
      const response = await getCitizens();

      setCitizens(
        Array.isArray(response)
          ? response
          : response?.data || [],
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshAssetTypes = useCallback(async () => {
    try {
      const response = await assetService.getAssetTypes();

      setAssetTypes(
        Array.isArray(response)
          ? response
          : response?.data || [],
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshTaxTypes = useCallback(async () => {
    try {
      const response = await assetService.getTaxTypes();

      setTaxTypes(
        Array.isArray(response)
          ? response
          : response?.data || [],
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await Promise.all([
        refreshCitizens(),
        refreshAssetTypes(),
        refreshTaxTypes(),
      ]);

      setLoading(false);
    };

    load();
  }, [
    refreshCitizens,
    refreshAssetTypes,
    refreshTaxTypes,
  ]);

  return (
    <AppDataContext.Provider
      value={{
        citizens,
        assetTypes,
        taxTypes,
        loading,
        refreshCitizens,
        refreshAssetTypes,
        refreshTaxTypes,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => useContext(AppDataContext);