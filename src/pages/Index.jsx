
import { withAuthInfo, useRedirectFunctions, useLogoutFunction } from '@propelauth/react'
import { useColors } from "./colors";
import { Heading, Text, Box } from "@chakra-ui/react";

const Index = withAuthInfo((props) => {
  const { textColor } = useColors();
  return (
    <Box>
      <Heading size="xl" mb={4} color={textColor}>
        Home
      </Heading>
      <Text>
        The good stuff is in the Activity page
      </Text>
    </Box>
  );
}
)

export default Index
