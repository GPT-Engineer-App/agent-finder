
import { withAuthInfo, useRedirectFunctions, useLogoutFunction } from '@propelauth/react'
import { Heading } from "@chakra-ui/react";
import { useColors } from "./colors";



const Settings = withAuthInfo((props) => {
    const { textColor } = useColors();
    return (
        <Heading size="xl" mb={4} color={textColor}>
        Settings
        </Heading>
    )
    }
)

export default Settings
