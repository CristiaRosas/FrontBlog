import { useEffect, useState, useRef } from "react";
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
  Text,
  Avatar,
  Image,
  Spinner,
  Textarea,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getcomments,
  getCommentByPublication,
  deleteComment,
  updateComment,
} from "../services/api";
import Lupa from "../assets/Lupa.png";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [originalComments, setOriginalComments] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const fetchComments = async (title = "") => {
    setLoading(true);
    setError(null);

    const res = title
      ? await getCommentByPublication(title)
      : await getcomments();

    const data = res?.data?.comments || [];

    if (res.error || !data.length) {
      setError(
        res.error
          ? "¡Error al cargar los comentarios!"
          : "¡No se encontraron comentarios para esta publicación!"
      );
      setComments([]);
      setOriginalComments([]);
    } else {
      setOriginalComments(data);
      setComments(filter ? sortComments(data, filter) : data);
    }

    setLoading(false);
  };

  const sortComments = (items, criterion) => {
    return items.slice().sort((a, b) => {
      switch (criterion) {
        case "course":
          return (a.publication?.course?.name || "").localeCompare(
            b.publication?.course?.name || ""
          );
        case "date":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "author":
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    setComments(
      filter ? sortComments(originalComments, filter) : originalComments
    );
  }, [filter]);

  useEffect(() => {
    fetchComments();
  }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
    onOpen();
  };

  const handleDelete = async () => {
    const res = await deleteComment(deleteId);
    if (!res.error) fetchComments(searchTitle.trim());
    onClose();
  };

  const handleEdit = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;
    const res = await updateComment(id, editText.trim());
    if (!res.error) {
      setEditingId(null);
      setEditText("");
      fetchComments(searchTitle.trim());
    }
  };

  return (
    <Box maxW="container.lg" mx="auto" py={10} px={4}>
      <Box textAlign="center" mb={10}>
        <Heading as="h1" size="2xl" fontWeight="bold" mb={2}>
          Comentarios
        </Heading>
        <Text color="gray.500">
          Explora los comentarios de las publicaciones!
        </Text>
      </Box>

      <Flex mb={8} gap={4} flexWrap="wrap" justifyContent="center">
        <Box flex="1 1 300px" maxW="600px">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar comentarios por título de la publicación"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && fetchComments(searchTitle.trim())
            }
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </Box>
        <Button
          colorScheme="gray"
          onClick={() => fetchComments(searchTitle.trim())}
          aria-label="Buscar comentarios"
          leftIcon={<Image src={Lupa} alt="Buscar" boxSize={5} />}
        >
          Buscar
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => {
            setSearchTitle("");
            fetchComments();
          }}
        >
          Mostrar Todo
        </Button>
      </Flex>

      {error && (
        <Box
          bg="red.100"
          color="red.700"
          p={4}
          borderRadius="md"
          textAlign="center"
          mb={6}
        >
          {error}
        </Box>
      )}

      {loading && (
        <Flex justify="center" align="center" minH="100px">
          <Spinner size="xl" />
        </Flex>
      )}

      {!loading && comments.length > 0 && (
        <Flex flexWrap="wrap" justify="center" gap={6}>
          {comments.map(({ _id, publication, author, comment, createdAt }) => (
            <Card
              key={_id}
              maxW="md"
              boxShadow="md"
              borderRadius="md"
              cursor="default"
              _hover={{ boxShadow: "lg" }}
              flex="1 1 300px"
            >
              <CardHeader>
                <Flex
                  spacing="4"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <Avatar name={author || publication?.title || "Anónimo"} />
                    <Box>
                      <Heading size="sm">
                        {author || publication?.title || "Anónimo"}
                      </Heading>
                      <Text fontSize="sm" color="gray.500">
                        Curso: {publication?.course?.name || "Sin curso"}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Título: {publication?.title || "Sin título"}
                      </Text>
                    </Box>
                  </Flex>

                  <IconButton
                    variant="ghost"
                    colorScheme="gray"
                    aria-label="Opciones"
                    icon={<BsThreeDotsVertical />}
                  />
                </Flex>
              </CardHeader>

              <CardBody>
                {editingId === _id ? (
                  <Box>
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      resize="none"
                      placeholder="Editar comentario..."
                    />
                    <Flex mt={2} gap={2}>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleSaveEdit(_id)}
                      >
                        Guardar
                      </Button>
                      <Button
                        colorScheme="gray"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancelar
                      </Button>
                    </Flex>
                  </Box>
                ) : (
                  <Text>{comment}</Text>
                )}
              </CardBody>

              <CardFooter justify="flex-end" gap={2}>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => handleEdit(_id, comment)}
                >
                  Editar
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => confirmDelete(_id)}
                >
                  Eliminar
                </Button>
              </CardFooter>

              <Image
                objectFit="cover"
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Imagen relacionada"
                maxH="180px"
                w="100%"
                borderBottomRadius="md"
              />

              <Box px={4} pb={4} fontSize="sm" color="gray.500">
                Creado:{" "}
                {new Date(createdAt).toLocaleDateString("es-CL", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Box>
            </Card>
          ))}
        </Flex>
      )}

      {!loading && comments.length === 0 && !error && (
        <Box
          bg="blue.100"
          color="blue.700"
          p={4}
          borderRadius="md"
          textAlign="center"
        >
          No hay comentarios disponibles.
        </Box>
      )}

      {/* Confirmación de eliminación */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar eliminación
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro que deseas eliminar este comentario? Esta acción no
              se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Comments;
