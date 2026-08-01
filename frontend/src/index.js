import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

import { TaxProvider } from "./context/TaxContext";

import { ParametersProvider } from "./context/ParametersContext";

import { RulesProvider } from "./context/RulesContext";

import { CitizensProvider } from "./context/CitizensContext";
import { AppDataProvider } from "./context/AppDataContext";
import "./styles/enterprise-grid.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <TaxProvider>
    <ParametersProvider>
      <RulesProvider>
        <CitizensProvider>
          <AppDataProvider>
            <App />
          </AppDataProvider>
        </CitizensProvider>
      </RulesProvider>
    </ParametersProvider>
  </TaxProvider>,
);
