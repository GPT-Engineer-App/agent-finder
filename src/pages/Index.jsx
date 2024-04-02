
import { withAuthInfo, useRedirectFunctions, useLogoutFunction } from '@propelauth/react'
import { useColors } from "./colors";
import { Heading } from "@chakra-ui/react";

const Index = withAuthInfo((props) => {
  const { textColor } = useColors();
  return (
    <Heading size="xl" mb={4} color={textColor}>
      Home
    </Heading>
  )
}
)

export default Index
