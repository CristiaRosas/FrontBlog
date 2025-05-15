import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 px-5 shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand text-uppercase fw-bold fs-4" to="/">
                    Blog de Aprendizaje
                </Link>
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link text-light fw-semibold px-3" to="/publications">
                                Publications
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-light fw-semibold px-3" to="/comments">
                                Comments
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
