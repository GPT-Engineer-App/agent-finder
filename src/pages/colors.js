// colors.js
import { useColorModeValue } from "@chakra-ui/react";

export const useColors = () => {
  const bgColor = useColorModeValue( "brand.100", "brand.100");
  const textColor = useColorModeValue("brand.900", "brand.900");
  const cardBgColor = useColorModeValue("brand.50", "brand.50");
  const cardTextColor = useColorModeValue("brand.900", "brand.900");
  const buttonBgColor = useColorModeValue("brand.200", "brand.400");
  const buttonTextColor = useColorModeValue("brand.600", "brand.600");
  const iconColor = useColorModeValue("brand.200", "brand.200");

  return {
    bgColor,
    textColor,
    cardBgColor,
    cardTextColor,
    buttonBgColor,
    buttonTextColor,
    iconColor,
  };
};