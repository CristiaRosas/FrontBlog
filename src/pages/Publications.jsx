import { useEffect, useState } from "react";
import { getPublications, postComment, getPublicationsByCourseName } from "../services/api";
import Lupa from "../assets/Lupa.png";

const Publications = () => {
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
      setError(res.error ? "¡Error al cargar las publicaciones!" : "¡No se encontraron publicaciones!");
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

    const res = await postComment({ author, comment, publication: selectedPublication.title });
    if (!res.error) {
      setAuthor("");
      setComment("");
      setCommentSuccess(true);
      fetchPublications(searchCourse);
    }
  };

  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold">Explorar Publicaciones</h1>
        <p className="text-muted">Encuentra y comenta las últimas publicaciones</p>
      </header>

      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar publicaciones por nombre del curso"
            value={searchCourse}
            onChange={(e) => setSearchCourse(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPublications(searchCourse.trim())}
          />
        </div>
        <div className="col-md-4 text-end d-flex align-items-center justify-content-end">
          <button
            className="btn btn-light me-2 p-2"
            style={{ border: "1px solid #ccc", background: "#fff" }}
            onClick={() => fetchPublications(searchCourse.trim())}
            title="Buscar"
          >
            <img src={Lupa} alt="Buscar" style={{ width: 24, height: 24 }} />
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchCourse("");
              fetchPublications();
            }}
          >
            Mostrar Todo
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {loading && <div className="text-center">Cargando publicaciones...</div>}

      {!loading && publications.length > 0 && (
        <div className="row">
          {publications.map((pub) => (
            <div key={pub._id} className="col-md-6 col-lg-4 mb-4">
              <div
                className="card h-100 shadow-sm"
                onClick={() => setSelectedPublication(pub)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  <h5 className="card-title text-primary">{pub.title}</h5>
                  <p className="card-text">
                    <strong>Curso:</strong> {pub.course?.name || "Sin curso asignado"}
                  </p>
                  <p className="card-text">{pub.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      <strong>Creado:</strong>{" "}
                      {new Date(pub.createdAt).toLocaleDateString("es-CL", {
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

      {selectedPublication && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Comentar en: {selectedPublication.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedPublication(null)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Escribe el nombre o dejar vacío para anónimo"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <textarea
                  className="form-control mb-3"
                  placeholder="Escribe tu comentario aquí..."
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success" onClick={handleSubmit}>
                  Enviar Comentario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {commentSuccess && (
        <div className="alert alert-success text-center mt-4">
          ¡Comentario enviado exitosamente!
        </div>
      )}
    </div>
  );
};

export default Publications;