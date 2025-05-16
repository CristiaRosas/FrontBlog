import {
  Box,
  Flex,
  Image,
  IconButton,
  Button,
  HStack,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import Home from "/src/assets/Home.jpg";
import { useEffect, useState } from "react";

// Lista de avatares aleatorios (puedes usar más URLs o usar un generador)
const avatars = [
  "https://i.pravatar.cc/150?img=11",
  "https://i.pravatar.cc/150?img=25",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=41",
  "https://i.pravatar.cc/150?img=54"
];

const MotionBox = motion(Box);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setAvatar(randomAvatar);
  }, []);

  const links = [
    { name: "Publications", to: "/publications" },
    { name: "Comments", to: "/comments" },
  ];

  return (
    <MotionBox
      bg="black"
      color="white"
      px={6}
      py={4}
      boxShadow="md"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <HStack spacing={4}>
          <RouterLink to="/">
            <Image src={Home} alt="Inicio" boxSize="38px" borderRadius="full" />
          </RouterLink>
          <Text fontWeight="bold" fontSize="xl" color="gray.200">Mi Blog </Text>
        </HStack>

        {/* Desktop Links */}
        <HStack spacing={8} display={{ base: "none", md: "flex" }}>
          {links.map((link) => (
            <Button
              key={link.to}
              as={RouterLink}
              to={link.to}
              variant="ghost"
              color="gray.300"
              _hover={{ color: "white", transform: "scale(1.05)" }}
              transition="all 0.3s"
            >
              {link.name}
            </Button>
          ))}
        </HStack>

        <HStack spacing={4}>
          <Avatar size="sm" name="Usuario" src={avatar} />
          <IconButton
            aria-label="Abrir menú"
            icon={<HamburgerIcon />}
            display={{ base: "inline-flex", md: "none" }}
            onClick={onOpen}
            variant="ghost"
            color="white"
            _hover={{ bg: "gray.700" }}
          />
        </HStack>
      </Flex>

      {/* Mobile Menu */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="black" color="white">
          <DrawerCloseButton />
          <DrawerHeader>Navegación</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              {links.map((link) => (
                <Button
                  key={link.to}
                  as={RouterLink}
                  to={link.to}
                  variant="ghost"
                  onClick={onClose}
                  _hover={{ bg: "gray.700" }}
                >
                  {link.name}
                </Button>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </MotionBox>
  );
};

export default Navbar;
