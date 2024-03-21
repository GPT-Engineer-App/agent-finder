import React, { useState, useEffect } from "react";
import axios from 'axios';

import { Box, Text, Image, VStack, HStack, Avatar, Input, Button, Heading, Divider, Spacer, Wrap, WrapItem } from "@chakra-ui/react";
import { FaSearch, FaPhone, FaEnvelope, FaCommentAlt, FaCalendar, FaStar } from "react-icons/fa";

const apiKey = import.meta.env.VITE_X_API_KEY;


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
        // Fetch activity
        const response = await axios.get("https://us-east-2.aws.neurelo.com/custom/activity", {
          headers: {
            'x-api-key': apiKey
          }
        });
        // Group listings by agent_phone
        const agentsMap = response.data.data.reduce((activityEntry, listing) => {
          const agentPhone = listing.agent_phone;
          if (!activityEntry[agentPhone]) {
            activityEntry[agentPhone] = {
              agent_name: fullAgent.data.data.agent_name,
              agent_phone: listing.agent_phone,
              agent_email: listing.agent_email,
              agent_photo: listing.agent_photo,
              agent_id: listing.agent_id,
              recentActivity: []
            };
          }
          activityEntry[agentPhone].recentActivity.push({
            type: listing.listing_status,
            address: listing.address,
            date: listing.listing_date,
            price: listing.price,
            listing_photo: listing.listing_photo // Add this line
          });
          return activityEntry;
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
          <Image
            boxSize="150px"
            objectFit="cover"
            src={activity.listing_photo}
            alt="Listing photo"
            borderRadius="4px"
          />
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
