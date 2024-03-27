import { AuthProvider } from "@propelauth/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};
// 2. Add your color mode config
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}
const theme = extendTheme({ colors, config });
export default theme

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider authUrl={"https://700811920.propelauthtest.com"}>
      <React.StrictMode>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </React.StrictMode>
    </AuthProvider>
);

