import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Select,
  Textarea,
  Alert,
  AlertIcon,
  Spinner,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import Lupa from "../assets/Lupa.png";
import { BiLike, BiChat, BiShare } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { usePublications } from "../shared/hooks/usePublications";

const Publications = () => {
  const {
    publications,
    selectedPublication,
    setSelectedPublication,
    comment,
    setComment,
    author,
    setAuthor,
    searchCourse,
    setSearchCourse,
    error,
    loading,
    commentSuccess,
    setCommentSuccess,
    fetchPublications,
    handleSubmit,
    openModal,
  } = usePublications();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const uniqueCourses = Array.from(
    new Set(
      publications
        .map((pub) => pub.course?.name)
        .filter((courseName) => courseName && courseName.trim() !== "")
    )
  );

  return (
    <Box maxW="container.lg" mx="auto" py={8} px={4}>
      <Box textAlign="center" mb={8}>
        <Heading size="xl" mb={2}>
          Explorar Publicaciones
        </Heading>
        <Text color="gray.500">Encuentra y comenta las últimas publicaciones</Text>
      </Box>

      <Flex
        mb={10}
        gap={4}
        flexWrap="wrap"
        justify="center"
        align="center"
        direction={{ base: "column", md: "row" }}
      >
        <Flex
          align="center"
          bg="white"
          borderRadius="full"
          boxShadow="lg"
          px={4}
          py={2}
          w={{ base: "100%", md: "400px" }}
          transition="all 0.2s ease"
          _hover={{ boxShadow: "xl" }}
        >
          <Image src={Lupa} alt="Buscar" boxSize={5} mr={2} />
          <Select
            variant="unstyled"
            placeholder="Selecciona un curso para buscar"
            value={searchCourse}
            onChange={(e) => setSearchCourse(e.target.value)}
            w="100%"
            _focus={{ boxShadow: "none" }}
          >
            {uniqueCourses.map((course, idx) => (
              <option key={idx} value={course}>
                {course}
              </option>
            ))}
          </Select>
        </Flex>

        <Button
          colorScheme="blue"
          borderRadius="full"
          px={6}
          boxShadow="lg"
          transition="all 0.2s ease"
          _hover={{ boxShadow: "xl", transform: "scale(1.05)" }}
          onClick={() => fetchPublications(searchCourse.trim())}
        >
          Buscar
        </Button>

        <Button
          variant="outline"
          colorScheme="gray"
          borderRadius="full"
          px={6}
          boxShadow="lg"
          transition="all 0.2s ease"
          _hover={{ boxShadow: "xl", transform: "scale(1.05)" }}
          onClick={() => {
            setSearchCourse("");
            fetchPublications();
          }}
        >
          Mostrar Todo
        </Button>
      </Flex>

      {error && (
        <Alert status="error" mb={6} justifyContent="center">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {commentSuccess && (
        <Alert status="success" mb={6} justifyContent="center">
          <AlertIcon />
          ¡Comentario enviado exitosamente!
        </Alert>
      )}

      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Flex flexWrap="wrap" gap={6} justify="center">
          {publications.map((pub) => (
            <Card
              key={pub._id}
              maxW="md"
              cursor="pointer"
              onClick={() => openModal(pub, onOpen)}
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <CardHeader>
                <Flex
                  spacing="4"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                >
                  <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <Avatar
                      name={pub.author || pub.title}
                      src={pub.avatarUrl || "https://bit.ly/sage-adebayo"}
                    />
                    <Box>
                      <Heading size="sm">{pub.author || pub.title}</Heading>
                      <Text fontSize="sm" color="gray.500">
                        {pub.course?.name || "Curso no asignado"}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Creado:{" "}
                        {new Date(pub.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                    </Box>
                  </Flex>
                  <IconButton
                    variant="ghost"
                    colorScheme="gray"
                    aria-label="See menu"
                    icon={<BsThreeDotsVertical />}
                  />
                </Flex>
              </CardHeader>
              <CardBody>
                <Text noOfLines={3}>{pub.description}</Text>
              </CardBody>
              {pub.imageUrl && (
                <Image
                  objectFit="cover"
                  src={pub.imageUrl}
                  alt={pub.title}
                  maxH="200px"
                  width="100%"
                />
              )}
              <CardFooter
                justify="space-between"
                flexWrap="wrap"
                sx={{
                  "& > button": {
                    minW: "136px",
                  },
                }}
              >
                <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
                  Comment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Flex>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comentar en: {selectedPublication?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              mb={4}
              placeholder="Escribe el nombre o dejar vacío para anónimo"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <Textarea
              placeholder="Escribe tu comentario aquí..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={(e) => handleSubmit(e, onClose)}
            >
              Enviar Comentario
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Publications;
