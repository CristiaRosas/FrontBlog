import { useState, useEffect, useRef } from "react";
import {
  getcomments,
  getCommentByPublication,
  deleteComment,
  updateComment,
} from "../../services/api";

export const useComments = () => {
  const [comments, setComments] = useState([]);
  const [originalComments, setOriginalComments] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteId, setDeleteId] = useState(null);

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

  const confirmDelete = (id, onOpen) => {
    setDeleteId(id);
    onOpen();
  };

  const handleDelete = async (onClose) => {
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

  return {
    comments,
    originalComments,
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
    deleteId,
    setDeleteId,
    cancelRef,
    fetchComments,
    confirmDelete,
    handleDelete,
    handleEdit,
    handleSaveEdit,
  };
};