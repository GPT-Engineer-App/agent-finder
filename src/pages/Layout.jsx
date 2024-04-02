import React, { useState } from "react";
import { Box, Flex, VStack, Heading, Avatar, Menu, MenuButton, MenuList, MenuItem, Button, useColorMode, IconButton, useMediaQuery, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaHome, FaRegLightbulb, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { withAuthInfo, useRedirectFunctions, useLogoutFunction } from '@propelauth/react'

const menuItems = [
  { label: "Home", icon: FaHome, link: "/" },
  { label: "Activity", icon: FaHome, link: "/activity" },
  { label: "Settings", icon: FaHome, link: "/settings" },
  { label: "Analytics", icon: FaHome, link: "/analytics" },
  { label: "Settings", icon: FaHome },
  { label: "Help", icon: FaHome },
];

// const Activity = withAuthInfo((props) => {
// const Layout = ({ children}) => {  
// const Layout = withAuthInfo({ children }) => {
const Layout = withAuthInfo(({ children, ...props }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const logoutFunction = useLogoutFunction()
  const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions()


  const commonStyles = {
    px: 4,
    py: 2,
    rounded: "md",
    _hover: { bg: colorMode === "dark" ? "gray.600" : "gray.100" },
  };

  return (
    <Flex h="100vh" bg={colorMode === "light" ? "white" : "gray.800"}>
      { }
      {!isLargerThan768 ? (
        <IconButton aria-label="Open menu" icon={<FaBars />} onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} size="lg" mr={2} />
      ) : (
        <Box w="250px" bg={colorMode === "dark" ? "gray.700" : "gray.50"} p={4}>
          <Heading size="md" mb={8} color={colorMode === "dark" ? "white" : "black"}>
            My App
          </Heading>
          <VStack align="stretch" spacing={1}>
            {menuItems.map((item, index) => (
              <Button key={index} as={Link} to={item.link || "#"} leftIcon={<item.icon />} variant="ghost" justifyContent="start" color={colorMode === "dark" ? "white" : "black"} {...commonStyles}>
                {item.label}
              </Button>
            ))}
          </VStack>
        </Box>
      )}

      <Drawer isOpen={isMobileNavOpen} placement="left" onClose={() => setIsMobileNavOpen(false)}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader bg={colorMode === "dark" ? "gray.700" : "gray.50"}>My App</DrawerHeader>
            <DrawerBody>
              <VStack align="stretch" spacing={1}>
                {menuItems.map((item, index) => (
                  <Button key={index} as={Link} to={item.link || "#"} leftIcon={<item.icon />} variant="ghost" justifyContent="start" color={colorMode === "dark" ? "white" : "black"} {...commonStyles}>
                    {item.label}
                  </Button>
                ))}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      { }
      <Box flex={1} p={8}>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg" color={colorMode === "dark" ? "white" : "black"}>
            Welcome back, John!
          </Heading>
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
        {children}
      </Box>
    </Flex>
  );
});

export default Layout;