import { RequiredAuthProvider, RedirectToLogin } from "@propelauth/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutTop from "./pages/LayoutTop";
import Index from "./pages/Index";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import theme from "./pages/theme";
const authUrl = import.meta.env.VITE_AUTH_URL;

ReactDOM.createRoot(document.getElementById("root")).render(
  <RequiredAuthProvider   authUrl={authUrl}
    displayIfLoggedOut={
      <RedirectToLogin
        postLoginRedirectUrl={window.location.href}
      />}
  >
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <LayoutTop>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </LayoutTop>
      </ChakraProvider>
    </BrowserRouter>
  </RequiredAuthProvider>
);

