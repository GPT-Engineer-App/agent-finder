import { RequiredAuthProvider } from "@propelauth/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import App from "./App.jsx";
import Layout from "./pages/Layout";
import Index from "./pages/Index";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import theme from "./pages/theme";


ReactDOM.createRoot(document.getElementById("root")).render(
  <RequiredAuthProvider authUrl={"https://700811920.propelauthtest.com"}>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
      </ChakraProvider>
    </BrowserRouter>
  </RequiredAuthProvider>
);

