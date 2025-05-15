import { useEffect, useState } from "react";
import { getcomments, getCommentByPublication } from "../services/api";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [originalComments, setOriginalComments] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchComments = async (title = "") => {
    setLoading(true);
    setError(null);

    const res = title
      ? await getCommentByPublication(title)
      : await getcomments();

    const data = res?.data?.comments || [];

    if (res.error || !data.length) {
      setError(res.error ? "¡Error al cargar los comentarios!" : "¡No se encontraron comentarios para esta publicación!");
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
          return (a.publication?.course?.[0]?.name || "").localeCompare(
            b.publication?.course?.[0]?.name || ""
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
    setComments(filter ? sortComments(originalComments, filter) : originalComments);
  }, [filter]);

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold">Comentarios</h1>
        <p className="text-muted">Explora los comentarios de las publicaciones</p>
      </header>

      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar comentarios por título de la publicación"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchComments(searchTitle.trim())}
          />
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary me-2"
            onClick={() => fetchComments(searchTitle.trim())}
          >
            Buscar
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchTitle("");
              fetchComments();
            }}
          >
            Mostrar Todo
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {loading && <div className="text-center">Cargando comentarios...</div>}

      {!loading && comments.length > 0 && (
        <div className="row">
          {comments.map(({ _id, publication, author, comment, createdAt }) => (
            <div key={_id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{publication?.title || "Sin título"}</h5>
                  <p className="card-text text-muted">
                    <strong>Curso:</strong> {publication?.course?.[0]?.name || "Sin curso"}
                  </p>
                  <p className="card-text">
                    <strong>Autor:</strong> {author || "Anónimo"}
                  </p>
                  <p className="card-text">
                    <strong>Comentario:</strong> {comment}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      <strong>Creado:</strong>{" "}
                      {new Date(createdAt).toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && comments.length === 0 && !error && (
        <div className="alert alert-info text-center">
          No hay comentarios disponibles.
        </div>
      )}
    </div>
  );
};

export default Comments;