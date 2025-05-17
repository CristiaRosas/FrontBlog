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
  Input,
  Textarea,
  Alert,
  AlertIcon,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import Lupa from "../assets/Lupa.png";

import { BiLike, BiChat, BiShare } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

import { useEffect, useState } from "react";
import {
  getPublications,
  postComment,
  getPublicationsByCourseName,
} from "../services/api";

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentSuccess, setCommentSuccess] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchPublications = async (query = "") => {
    setLoading(true);
    setError(null);
    setSelectedPublication(null);
    setCommentSuccess(false);

    const res = query
      ? await getPublicationsByCourseName(query)
      : await getPublications();

    if (res.error || !res.data.publications.length) {
      setError(
        res.error
          ? "¡Error al cargar las publicaciones!"
          : "¡No se encontraron publicaciones!"
      );
      setPublications([]);
    } else {
      setPublications(res.data.publications);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const res = await postComment({
      author,
      comment,
      publication: selectedPublication.title,
    });
    if (!res.error) {
      setAuthor("");
      setComment("");
      setCommentSuccess(true);
      fetchPublications(searchCourse);
      onClose();
    }
  };

  const openModal = (pub) => {
    setSelectedPublication(pub);
    onOpen();
  };

  return (
    <Box maxW="container.lg" mx="auto" py={8} px={4}>
      <Box textAlign="center" mb={8}>
        <Heading size="xl" mb={2}>
          Explorar Publicaciones
        </Heading>
        <Text color="gray.500">
          Encuentra y comenta las últimas publicaciones
        </Text>
      </Box>

      {/* Search */}
      <Flex mb={6} gap={2} flexWrap="wrap" justify="center">
        <Input
          maxW="400px"
          placeholder="Buscar publicaciones por nombre del curso"
          value={searchCourse}
          onChange={(e) => setSearchCourse(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && fetchPublications(searchCourse.trim())
          }
        />
        <Button
          colorScheme="gray"
          onClick={() => fetchPublications(searchCourse.trim())}
          aria-label="Buscar publicaciones"
          leftIcon={<Image src={Lupa} alt="Buscar" boxSize={5} />}
        >
          Buscar
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => {
            setSearchCourse("");
            fetchPublications();
          }}
        >
          Mostrar Todo
        </Button>
      </Flex>

      {/* Alerts */}
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
              onClick={() => openModal(pub)}
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

      {/* Modal para comentar */}
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
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
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
