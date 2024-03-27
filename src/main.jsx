import { AuthProvider } from "@propelauth/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";


// https://coolors.co/palette/000000-14213d-fca311-e5e5e5-ffffff
const colors = {
  brand: {
    50: "#FFFFFF",
    100: "#E5E5E5",
    200: "#FCA311",
    600: "#14213D",
    900: "#000814"
  },
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false
};

const fonts = {
  heading: 'Tahoma',
  body: 'Tahoma',
}

const theme = extendTheme({ colors, config, fonts });
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

