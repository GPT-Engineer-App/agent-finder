import React, { useState } from "react";
import {
  Box, Flex, HStack, Heading, Avatar, Menu, MenuButton, MenuList, MenuItem, Button,
  useColorMode, IconButton, useMediaQuery, Drawer, DrawerBody, DrawerHeader, DrawerOverlay,
  DrawerContent, DrawerCloseButton, VStack
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaHome, FaRegLightbulb, FaUser, FaSignOutAlt, FaCog, FaChartBar, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { withAuthInfo, useRedirectFunctions, useLogoutFunction } from '@propelauth/react';

const menuItems = [
  { label: "Home", icon: FaHome, link: "/" },
  { label: "Activity", icon: FaRegLightbulb, link: "/activity" },
  { label: "Settings", icon: FaCog, link: "/settings" },
  { label: "Analytics", icon: FaChartBar, link: "/analytics" },
  { label: "Help", icon: FaQuestionCircle },
];
const LayoutTop = withAuthInfo(({ children, ...props }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const logoutFunction = useLogoutFunction();
  const { redirectToAccountPage } = useRedirectFunctions();

  const commonStyles = {
    px: 4,
    py: 2,
    rounded: "md",
    _hover: { bg: colorMode === "dark" ? "gray.600" : "gray.100" },
  };

  return (
    <Flex direction="column" h="100vh" bg={colorMode === "light" ? "white" : "gray.800"}>
      <Box as="header" w="full" bg={colorMode === "dark" ? "gray.700" : "gray.50"} p={4}>
        <Flex justify="flex-end" align="left">
        {!isLargerThan768 ? (
            <>
              <Flex flex={1} justify="flex-start">
              <IconButton aria-label="Open menu" icon={<FaBars />} onClick={() => setIsMobileNavOpen(true)} size="lg"/>
              <Avatar  p={1} src="6.png" />
              </Flex>  
            </>
          ) : (
            <>
              <Flex flex={1} justify="flex-start">
                <Avatar src="6.png" />
                <HStack spacing={1}>
                  {menuItems.map((item, index) => (
                    <Button key={index} as={Link} to={item.link} leftIcon={<item.icon />} variant="ghost" justifyContent="start" {...commonStyles}>
                      {item.label}
                    </Button>
                  ))}
                </HStack>
              </Flex>

            </>
          )}
          <Menu> 
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar src={props.isLoggedIn ? props.user.pictureUrl : undefined} name={props.isLoggedIn ? undefined : "Guest"} />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FaUser />} onClick={() => redirectToAccountPage()} {...commonStyles}>
                Profile
              </MenuItem>
              <MenuItem icon={<FaRegLightbulb />} onClick={toggleColorMode} {...commonStyles}>
                {colorMode === "light" ? "Dark Mode" : "Light Mode"}
              </MenuItem>
              <MenuItem icon={<FaSignOutAlt />} onClick={() => logoutFunction(true)} {...commonStyles}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>

      <Drawer isOpen={isMobileNavOpen} placement="top" onClose={() => setIsMobileNavOpen(false)}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader bg={colorMode === "dark" ? "gray.700" : "gray.50"}>Menu</DrawerHeader>
            <DrawerBody>
              <VStack align="stretch" spacing={1}>
                {menuItems.map((item, index) => (
                  <Button key={index} as={Link} to={item.link} leftIcon={<item.icon />} variant="ghost" justifyContent="start" {...commonStyles} onClick={() => setIsMobileNavOpen(false)}>
                    {item.label}
                  </Button>
                ))}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <Box flex={1} p={0}>
        {children}
      </Box>
    </Flex>
  );
});

export default LayoutTop;