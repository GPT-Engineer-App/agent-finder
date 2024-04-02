
import { extendTheme } from "@chakra-ui/react";

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