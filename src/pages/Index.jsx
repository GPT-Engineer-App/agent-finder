import React, { useState } from "react";
import { Box, Text, Image, VStack, HStack, Avatar, Input, Button, Heading, Divider, Spacer } from "@chakra-ui/react";
import { FaSearch, FaPhone, FaEnvelope } from "react-icons/fa";

const agents = [
  {
    id: 1,
    name: "John Doe",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBwb3J0cmFpdHxlbnwwfHx8fDE3MTA0NjE4Mjl8MA&ixlib=rb-4.0.3&q=80&w=1080",
    phone: "(123) 456-7890",
    email: "john@example.com",
    sales: [
      { year: 2022, amount: 5000000 },
      { year: 2021, amount: 4500000 },
      { year: 2020, amount: 4000000 },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    photo: "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHwyfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBwb3J0cmFpdHxlbnwwfHx8fDE3MTA0NjE4Mjl8MA&ixlib=rb-4.0.3&q=80&w=1080",
    phone: "(987) 654-3210",
    email: "jane@example.com",
    sales: [
      { year: 2022, amount: 6000000 },
      { year: 2021, amount: 5500000 },
      { year: 2020, amount: 5000000 },
    ],
  },
  // Add more agents here
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAgents = agents.filter((agent) => agent.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box p={4}>
      <Heading size="xl" mb={4}>
        Real Estate Agents
      </Heading>
      <Input placeholder="Search agents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} mb={4} />
      <VStack spacing={4} align="stretch">
        {filteredAgents.map((agent) => (
          <Box key={agent.id} borderWidth={1} borderRadius="md" p={4}>
            <HStack spacing={4}>
              <Avatar size="lg" src={agent.photo} />
              <VStack align="start" spacing={1}>
                <Text fontSize="xl" fontWeight="bold">
                  {agent.name}
                </Text>
                <HStack>
                  <FaPhone />
                  <Text>{agent.phone}</Text>
                </HStack>
                <HStack>
                  <FaEnvelope />
                  <Text>{agent.email}</Text>
                </HStack>
              </VStack>
            </HStack>
            <Divider my={4} />
            <Heading size="md" mb={2}>
              Sales History
            </Heading>
            {agent.sales.map((sale, index) => (
              <HStack key={index}>
                <Text fontWeight="bold">{sale.year}:</Text>
                <Spacer />
                <Text>${sale.amount.toLocaleString()}</Text>
              </HStack>
            ))}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Index;
