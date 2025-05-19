import { useState, useEffect } from "react";
import {
  getPublications,
  postComment,
  getPublicationsByCourseName,
} from "../../services/api";

export const usePublications = () => {
  const [publications, setPublications] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentSuccess, setCommentSuccess] = useState(false);

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

  const handleSubmit = async (e, onClose) => {
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

  const openModal = (pub, onOpen) => {
    setSelectedPublication(pub);
    onOpen();
  };

  return {
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
  };
};