import { createContext, useContext, useEffect, useRef, useState } from "react";

import assetService from "../services/assetService";
import { getCitizens } from "../services/citizenService";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const initialized = useRef(false);

  const [citizens, setCitizens] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [taxTypes, setTaxTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    const load = async () => {
      try {
        const [citizenRes, assetTypeRes, taxTypeRes] =
          await Promise.all([
            getCitizens(),
            assetService.getAssetTypes(),
            assetService.getTaxTypes(),
          ]);

        setCitizens(
          Array.isArray(citizenRes)
            ? citizenRes
            : citizenRes?.data || [],
        );

        setAssetTypes(
          Array.isArray(assetTypeRes)
            ? assetTypeRes
            : assetTypeRes?.data || [],
        );

        setTaxTypes(
          Array.isArray(taxTypeRes)
            ? taxTypeRes
            : taxTypeRes?.data || [],
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        citizens,
        assetTypes,
        taxTypes,
        loading,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => useContext(AppDataContext);