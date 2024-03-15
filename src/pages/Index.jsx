import React, { useState } from "react";
import { Box, Text, Image, VStack, HStack, Avatar, Input, Button, Heading, Divider, Spacer } from "@chakra-ui/react";
import { FaSearch, FaPhone, FaEnvelope, FaCommentAlt, FaCalendar, FaStar } from "react-icons/fa";

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
    recentActivity: [
      { type: "New Listing", address: "123 Main St", date: "2024-03-14" },
      { type: "Open House", address: "456 Oak Ave", date: "2024-03-12" },
      { type: "Closed Sale", address: "789 Elm Rd", date: "2024-03-10" },
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
    recentActivity: [
      { type: "Price Change", address: "321 Pine St", date: "2024-03-13" },
      { type: "New Listing", address: "654 Birch Ln", date: "2024-03-11" },
      { type: "Open House", address: "987 Cedar Rd", date: "2024-03-09" },
    ],
  },
  // Add more agents here
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSales, setExpandedSales] = useState([]);

  const toggleExpandedSales = (agentId) => {
    setExpandedSales((prevExpandedSales) => {
      if (prevExpandedSales.includes(agentId)) {
        return prevExpandedSales.filter((id) => id !== agentId);
      } else {
        return [...prevExpandedSales, agentId];
      }
    });
  };

  const filteredAgents = agents.filter((agent) => agent.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box p={4}>
      <Heading size="xl" mb={4}>
        Real Estate Agents
      </Heading>
      <Input placeholder="Search agents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} mb={4} />
      <VStack spacing={4} align="stretch">
        {filteredAgents.map((agent) => (
          <Box key={agent.id} borderWidth={1} borderRadius="lg" boxShadow="md" p={4}>
            <HStack spacing={4} align="start">
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
              <Spacer />
              <VStack spacing={1}>
                <Box borderRadius="full" bg="gray.100" px={3} py={1}>
                  <HStack spacing={1}>
                    <Text fontSize="sm">$</Text>
                    <Text fontSize="sm" fontWeight="bold">
                      {(agent.sales[0].amount / 1000000).toFixed(1)}m
                    </Text>
                  </HStack>
                </Box>
                <Box borderRadius="full" bg="gray.100" px={3} py={1}>
                  <HStack spacing={1}>
                    <FaCalendar />
                    <Text fontSize="sm" fontWeight="bold">
                      {agent.sales.length} yrs
                    </Text>
                  </HStack>
                </Box>
                <Box borderRadius="full" bg="gray.100" px={3} py={1}>
                  <HStack spacing={1}>
                    <FaStar />
                    <Text fontSize="sm" fontWeight="bold">
                      Favorite
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </HStack>
            <Heading size="md" my={4}>
              Activity
            </Heading>
            <RecentActivity agent={agent} activities={agent.recentActivity} />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

const RecentActivity = ({ agent, activities }) => {
  return (
    <VStack align="stretch" spacing={2}>
      {activities.map((activity, index) => (
        <HStack key={index} spacing={4}>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">{activity.type}:</Text>
            <Text>{activity.address}</Text>
            <Text fontSize="sm" color="gray.500">
              {activity.date}
            </Text>
          </VStack>
          <Spacer />
          <FaCommentAlt cursor="pointer" onClick={() => window.open(`sms:${agent.phone}`)} />
        </HStack>
      ))}
    </VStack>
  );
};

export default Index;
