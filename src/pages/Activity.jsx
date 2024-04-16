import React, { useState, useEffect } from "react";
import axios from 'axios';
import { withAuthInfo, useRedirectFunctions, useLogoutFunction } from '@propelauth/react';
import { useColorMode, Box, ButtonGroup, Card, CardBody, CardFooter, Stack, Text, Image, VStack, HStack, Link, Menu, MenuButton, MenuItem, MenuList, Avatar, Input, Button, Heading, Divider, Spacer, Wrap, WrapItem, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, SimpleGrid } from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaSearch, FaPhone, FaEnvelope, FaCommentAlt, FaCalendar, FaStar } from "react-icons/fa";
import { useColors } from "./colors";

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
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Fetch activity
        // const response = await axios.get("https://ziptie.app/api/custom/activity", {
        const response = await axios.get("http://localhost:8000/custom/activity", {
          headers: {
            Authorization: `Bearer ${props.accessToken}`,
          },
        });
        // Group listings by agent_phone and sum up sales
        const arr = JSON.parse(response.data[0])['data']
        const agentsMap = arr.reduce((activityEntry, listing) => {
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

  // Existing state declarations
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const { isOpen: isAgentModalOpen, onOpen: onAgentModalOpen, onClose: onAgentModalClose } = useDisclosure();
  const { isOpen: isPropertyModalOpen, onOpen: onPropertyModalOpen, onClose: onPropertyModalClose } = useDisclosure();


  const handleAgentClick = (agent, event) => {
    event.stopPropagation(); // Prevent the event from bubbling up
    setSelectedAgent(agent);
    onAgentModalOpen(); // Assuming this opens the agent details modal
  };
  // Handler for when a property is clicked
  const handlePropertyClick = (property, event) => {
    event.stopPropagation(); // Prevent the event from bubbling up
    setSelectedProperty(property);
    onPropertyModalOpen(); // Assuming this opens the property details modal
  };



  return (
    <Box p={4} bg={colorMode === "dark" ? "blue.800" : "blue.50"}>
      <Heading size="xl" mb={4} color={colorMode === "dark" ? "white" : "black"}>
        Activity
      </Heading>
      <Input placeholder="Search agents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} mb={4} color={colorMode === "dark" ? "white" : "black"} />
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
          // <Box key={agent.listing_id} borderWidth={1} borderRadius="lg" boxShadow="md" p={4} bg={cardBgColor} color={cardTextColor}>
          <Box key={agent.listing_id} borderWidth={1} borderRadius="lg" boxShadow="md" p={4} bg={colorMode === "dark" ? "blue.700" : "blue.100"}>
            <HStack spacing={4} align="start">
              <HStack spacing={4}>
                <Avatar size="lg" src={agent.agent_photo} cursor="pointer" onClick={(e) => handleAgentClick(agent, e)} />
                <VStack align="start" spacing={1}>
                  <Text fontSize="l" fontWeight="bold" color={colorMode === "dark" ? "white" : "black"} cursor="pointer" onClick={(e) => handleAgentClick(agent, e)}>
                    {agent.agent_name}
                  </Text>
                  <HStack>
                    <Link href={`tel:${agent.agent_phone}`}><FaPhone /></Link>
                  </HStack>
                  <HStack>
                    <Link href={`mailto:${agent.agent_email}`}><FaEnvelope /></Link>
                  </HStack>
                </VStack>
              </HStack>
              <Spacer />
              <VStack spacing={1}>
                <Box borderRadius="full" bg="gray.100" px={3} py={1}>
                  <HStack spacing={1}>
                    <Text fontSize="sm" color={colorMode === "dark" ? "white" : "black"}>$</Text>
                    <Text fontSize="sm" fontWeight="bold" color={colorMode === "dark" ? "white" : "black"}>
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

              </VStack>
            </HStack>
            <RecentActivity agent={agent} activities={agent.recentActivity} onPropertyClick={handlePropertyClick} />
          </Box>
        ))}
      </VStack>
      {/* Modal for displaying selected agent details */}
      <Modal isOpen={isAgentModalOpen} onClose={onAgentModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedAgent?.agent_name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Display more details about the agent here */}
            <Text>Email: {selectedAgent?.agent_email}</Text>
            <Text>Phone: {selectedAgent?.agent_phone}</Text>
            {/* Add more details as needed */}
          </ModalBody>
          <ModalFooter>
            {/* Optional actions, like a close button */}
            <Button colorScheme="blue" mr={3} onClick={onAgentModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isPropertyModalOpen} onClose={onPropertyModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Property Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Display more details about the property here */}
            <Text>Address: {selectedProperty?.address}</Text>
            <Text>Price: ${selectedProperty?.price}</Text>
            <Text>Date: {selectedProperty?.date}</Text>
            {/* Add more details as needed */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onPropertyModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
});


const RecentActivity = ({ agent, activities, onPropertyClick }) => {
  const { textColor, iconColor } = useColors();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      {activities.map((activity, index) => (
        /*      <VStack key={index} spacing={4} onClick={(e) => onPropertyClick(activity, e)}>
                  <Image
                    minWidth={["100px", "150px"]}
                    width={["100px", "150px"]}
                    maxWidth={["100%", "150px"]}
                    objectFit="cover"
                    src={activity.listing_photo || "https://ziptie.app/nop.png"}
                    alt="Listing photo"
                    borderRadius="4px"
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={colorMode === "dark" ? "white" : "black"}>New Listing: ${activity.price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    <Text color={colorMode === "dark" ? "white" : "black"}>{activity.address}</Text>
                    <Text fontSize="sm" color={colorMode === "dark" ? "white" : "black"}>
                      {activity.date}
                    </Text>
                  </VStack>
                  <Spacer />
                  <FaCommentAlt color={iconColor} cursor="pointer" onClick={() => window.open(`sms:${agent.agent_phone}?body=hello%20world`)} />
                </VStack>
        */
        <Card maxW='sm' key={index} spacing={4} onClick={(e) => onPropertyClick(activity, e)}>
          <CardBody>
            <HStack>
              <Text fontWeight="bold" color={colorMode === "dark" ? "white" : "black"}>New: ${activity.price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
              <Spacer />
              <FaCommentAlt color={iconColor} cursor="pointer" onClick={() => window.open(`sms:${agent.agent_phone}?body=Hey ${agent.agent_name}! Saw your listing at ${activity.address}, congrats!`)} />
            </HStack>
            
            <Image
              src={activity.listing_photo || "https://ziptie.app/nop.png"}
              alt='Listing Photo'
              borderRadius='lg'
              maxW={{ base: '100%', sm: '200px' }}
              p={1} // Added padding
            />
            <Stack mt='6' spacing='3'>
              <Text color={colorMode === "dark" ? "white" : "black"}>{activity.address}</Text>
              <Text fontSize="sm" color={colorMode === "dark" ? "white" : "black"}>
                {activity.date}
              </Text>
            </Stack>
          </CardBody>
          
{/*           <Divider />
          <CardFooter>
            <ButtonGroup spacing='2'>
              <Button variant='solid' colorScheme='blue'>
                Buy now
              </Button>
              <Button variant='ghost' colorScheme='blue'>
                Add to cart
              </Button>
            </ButtonGroup>
          </CardFooter>
 */}        </Card>
      ))}
    </SimpleGrid>
  );
};

export default Activity;
