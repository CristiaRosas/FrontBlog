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
  Select,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Lupa from "../assets/Lupa.png";
import { useComments } from "../shared/hooks/useComment";

const Comments = () => {
  const {
    comments,
    searchTitle,
    setSearchTitle,
    error,
    loading,
    filter,
    setFilter,
    editingId,
    setEditingId,
    editText,
    setEditText,
    fetchComments,
    confirmDelete,
    handleDelete,
    handleEdit,
    handleSaveEdit,
    cancelRef,
  } = useComments();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Extraemos títulos únicos de las publicaciones para el Select
  const uniqueTitles = Array.from(
    new Set(comments.map((c) => c.publication?.title).filter(Boolean))
  );

  return (
    <Box maxW="container.lg" mx="auto" py={10} px={4}>
      <Box textAlign="center" mb={10}>
        <Heading as="h1" size="2xl" fontWeight="bold" mb={2}>
          Comentarios
        </Heading>
        <Text color="gray.500">Explora los comentarios de las publicaciones!</Text>
      </Box>

      {/* Barra de búsqueda con Select */}
      <Flex
        mb={8}
        gap={4}
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        direction={{ base: "column", md: "row" }}
      >
        <Select
          placeholder="Selecciona un título para buscar"
          maxW={{ base: "100%", md: "400px" }}
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          boxShadow="md"
          borderRadius="md"
          bg="white"
          _focus={{ boxShadow: "outline" }}
          transition="box-shadow 0.2s ease"
        >
          {uniqueTitles.map((title, i) => (
            <option key={i} value={title}>
              {title}
            </option>
          ))}
        </Select>

        <Button
          colorScheme="gray"
          borderRadius="full"
          px={6}
          boxShadow="lg"
          transition="all 0.2s ease"
          _hover={{ boxShadow: "xl", transform: "scale(1.05)" }}
          onClick={() => fetchComments(searchTitle.trim())}
          leftIcon={<Image src={Lupa} alt="Buscar" boxSize={5} />}
          aria-label="Buscar comentarios"
        >
          Buscar
        </Button>

        <Button
          colorScheme="blue"
          borderRadius="full"
          px={6}
          boxShadow="lg"
          transition="all 0.2s ease"
          _hover={{ boxShadow: "xl", transform: "scale(1.05)" }}
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
          boxShadow="md"
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
              bg="white"
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
                  onClick={() => confirmDelete(_id, onOpen)}
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
          boxShadow="md"
        >
          No hay comentarios disponibles.
        </Box>
      )}

      {/* Confirmación de eliminación */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar eliminación
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro que deseas eliminar este comentario? Esta acción no se
              puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={() => handleDelete(onClose)} ml={3}>
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
