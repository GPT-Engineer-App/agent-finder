
import React, { useState, useEffect } from "react";
import axios from 'axios';

import { Box, Text, Image, VStack, HStack, Avatar, Input, Button, Heading, Divider, Spacer, Wrap, WrapItem } from "@chakra-ui/react";
import { FaSearch, FaPhone, FaEnvelope, FaCommentAlt, FaCalendar, FaStar } from "react-icons/fa";

const apiKey = import.meta.env.VITE_X_API_KEY;

const agents_static = [
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

const SearchFilters = ({ filters, onFilterChange }) => {
  return (
    <Wrap spacing={2} mb={4}>
      {filters.map((filter) => (
        <WrapItem key={filter.value}>
          <Button size="sm" colorScheme={filter.selected ? "blue" : "gray"} onClick={() => onFilterChange(filter.value)}>
            {filter.label}
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  );
};

const Index = () => {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSales, setExpandedSales] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);


  useEffect(() => {
    const fetchAgents = async () => {
      try {

        const response = await axios.get("https://us-east-2.aws.neurelo.com/custom/activity", {
          headers: {
            'x-api-key': apiKey
          }
        });
        // Group listings by agent_phone
        const agentsMap = response.data.data.reduce((acc, listing) => {
          const agentPhone = listing.agent_phone;
          if (!acc[agentPhone]) {
            acc[agentPhone] = {
              agent_name: listing.agent_name,
              agent_phone: listing.agent_phone,
              agent_email: listing.agent_email,
              agent_photo: listing.agent_photo,
              recentActivity: []
            };
          }
          acc[agentPhone].recentActivity.push({
            type: listing.listing_status,
            address: listing.address,
            date: listing.listing_date,
            price: listing.price
          });
          return acc;
        }, {});
  
        // Convert the map to an array
        const agentsArray = Object.values(agentsMap);
        setAgents(agentsArray);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
  
    fetchAgents();
  }, []);

  const handleFilterChange = (filterValue) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters.includes(filterValue)) {
        return prevFilters.filter((value) => value !== filterValue);
      } else {
        return [...prevFilters, filterValue];
      }
    });
  };

  const toggleExpandedSales = (agentId) => {
    setExpandedSales((prevExpandedSales) => {
      if (prevExpandedSales.includes(agentId)) {
        return prevExpandedSales.filter((id) => id !== agentId);
      } else {
        return [...prevExpandedSales, agentId];
      }
    });
  };

  const filteredAgents = agents.filter((agent) => {
    const nameMatch = agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase());
    const filterMatch = selectedFilters.length === 0 || agent.recentActivity.some((activity) => selectedFilters.includes(activity.type));
    return nameMatch && filterMatch;
  });

  return (
    <Box p={4}>
      <Heading size="xl" mb={4}>
        Activity
      </Heading>
      <Input placeholder="Search agents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} mb={4} />
      <SearchFilters
        filters={[
          { label: "New Listings", value: "New Listing" },
          { label: "Closed Sale", value: "Closed Sale" },
          { label: "Open House", value: "Open House" },
          { label: "Price Change", value: "Price Change" },
        ]}
        onFilterChange={handleFilterChange}
      />
    <VStack spacing={4} align="stretch">
      {filteredAgents.map((agent) => (
        <Box key={agent.listing_id} borderWidth={1} borderRadius="lg" boxShadow="md" p={4}>
          <HStack spacing={4} align="start">
            <HStack spacing={4}>
              <Avatar size="lg" src={agent.agent_photo} />
              <VStack align="start" spacing={1}>
                <Text fontSize="xl" fontWeight="bold">
                  {agent.agent_name}
                </Text>
                <HStack>
                  <FaPhone />
                  <Text>{agent.agent_phone}</Text>
                </HStack>
                <HStack>
                  <FaEnvelope />
                  <Text>{agent.agent_email}</Text>
                </HStack>
              </VStack>
            </HStack>
            <Spacer />
            <VStack spacing={1}>
              <Box borderRadius="full" bg="gray.100" px={3} py={1}>
                <HStack spacing={1}>
                  <Text fontSize="sm">$</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {(parseFloat(agent.price) / 1000000).toFixed(1)}m
                  </Text>
                </HStack>
              </Box>
              <Box borderRadius="full" bg="gray.100" px={3} py={1}>
                <HStack spacing={1}>
                  <FaCalendar />
                  <Text fontSize="sm" fontWeight="bold">
                    {new Date(agent.agent_active_date).getFullYear()} yrs
                  </Text>
                </HStack>
              </Box>
              {/* ... other JSX ... */}
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
          <FaCommentAlt cursor="pointer" onClick={() => window.open(`sms:${agent.agent_phone}`)} />
        </HStack>
      ))}
    </VStack>
  );
};

export default Index;
