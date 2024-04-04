
import { withAuthInfo, useRedirectFunctions, useLogoutFunction } from '@propelauth/react'
import { Heading } from "@chakra-ui/react";
import { useColorMode } from '@chakra-ui/react';
import { useColors } from "./colors";



const Analytics = withAuthInfo((props) => {
    const { colorMode } = useColorMode();  
    return (
        <Heading size="xl" mb={4} color={colorMode === "dark" ? "white" : "black"}>
        Analytics
        </Heading>
    )
    }
)

export default Analytics
