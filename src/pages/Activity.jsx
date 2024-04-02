import React, { useState, useEffect } from "react";
import { useColors } from "./colors";
import axios from 'axios';
import { withAuthInfo, useRedirectFunctions, useLogoutFunction } from '@propelauth/react'

import { Box, Text, Image, VStack, HStack, Menu, MenuButton, MenuItem, MenuList, Avatar, Input, Button, Heading, Divider, Spacer, Wrap, WrapItem } from "@chakra-ui/react";
import { FaSearch, FaPhone, FaEnvelope, FaCommentAlt, FaCalendar, FaStar } from "react-icons/fa";
import { ChevronDownIcon } from '@chakra-ui/icons';
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

// const Index = ({ user }) => {
const Activity = withAuthInfo((props) => {

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
        // Group listings by agent_phone and sum up sales
        const agentsMap = response.data.data.reduce((activityEntry, listing) => {
          const agentPhone = listing.agent_phone;
          if (!activityEntry[agentPhone]) {
            activityEntry[agentPhone] = {
              agent_name: listing.agent_name,
              agent_phone: listing.agent_phone,
              agent_email: listing.agent_email,
              agent_photo: listing.agent_photo,
              agent_id: listing.agent_id,
              agent_active_date: listing.agent_active_date,
              recentActivity: [],
              agent_sales: 0 // Initialize agent_sales
            };
          }
          activityEntry[agentPhone].recentActivity.push({
            type: listing.listing_status,
            address: listing.address,
            date: listing.listing_date,
            price: listing.price,
            listing_photo: listing.listing_photo
          });
          // Sum up the price for agent_sales
          activityEntry[agentPhone].agent_sales += parseFloat(listing.price);
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

  const logoutFunction = useLogoutFunction()
  const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions()

  const { bgColor, textColor, cardBgColor, cardTextColor, buttonBgColor, buttonTextColor } = useColors();


  return (
    <Box p={4} bg={bgColor} color={textColor}>
      <Heading size="xl" mb={4} color={textColor}>
        Activity
      </Heading>
      <Input placeholder="Search agents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} mb={4} color={textColor} bg={cardBgColor} />
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
          <Box key={agent.listing_id} borderWidth={1} borderRadius="lg" boxShadow="md" p={4} bg={cardBgColor} color={cardTextColor}>
            <HStack spacing={4} align="start">
              <HStack spacing={4}>
                <Avatar size="lg" src={agent.agent_photo} />
                <VStack align="start" spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    {agent.agent_name}
                  </Text>
                  <HStack>
                    <FaPhone />
                    <Text color={textColor}>{agent.agent_phone}</Text>
                  </HStack>
                  <HStack>
                    <FaEnvelope />
                    <Text color={textColor}>{agent.agent_email}</Text>
                  </HStack>
                </VStack>
              </HStack>
              <Spacer />
              <VStack spacing={1}>
                <Box borderRadius="full" bg="gray.100" px={3} py={1}>
                  <HStack spacing={1}>
                    <Text fontSize="sm" color={textColor}>$</Text>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      {(parseFloat(agent.agent_sales) / 1000000).toFixed(1)}m
                    </Text>
                  </HStack>
                </Box>
                {agent.agent_active_date && parseInt(agent.agent_active_date) > 1 && (
                  <Box borderRadius="full" bg="gray.100" px={3} py={1}>
                    <HStack spacing={1}>
                      <FaCalendar />
                      <Text fontSize="sm" fontWeight="bold">
                        {parseInt(agent.agent_active_date)}
                      </Text>
                    </HStack>
                  </Box>
                )}
                {/* ... other JSX ... */}
              </VStack>
            </HStack>
            <Heading size="md" my={4} color={textColor}>
              Activity
            </Heading>
            <RecentActivity agent={agent} activities={agent.recentActivity} />
          </Box>
        ))}
      </VStack>
    </Box>
  );
});


const RecentActivity = ({ agent, activities }) => {
  const { textColor, iconColor } = useColors();

  return (
    <VStack align="stretch" spacing={2}>
      {activities.map((activity, index) => (
        <HStack key={index} spacing={4}>
          <Image
            boxSize="150px"
            objectFit="cover"
            src={activity.listing_photo || "https://ziptie.app/nop.png"}
            alt="Listing photo"
            borderRadius="4px"
          />
          <VStack align="start" spacing={0}>
            {/*Text fontWeight="bold">{activity.type}:</Text*/}
            <Text fontWeight="bold" color={textColor}>New Listing: ${activity.price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
            <Text color={textColor}>{activity.address}</Text>
            <Text fontSize="sm" color={textColor}>
              {activity.date}
            </Text>
          </VStack>
          <Spacer />
          <FaCommentAlt color={iconColor} cursor="pointer" onClick={() => window.open(`sms:${agent.agent_phone}?body=hello%20world`)} />
        </HStack>
      ))}
    </VStack>
  );
};

export default Activity;
