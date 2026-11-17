import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import Avatar from "./Avatar.jsx";
import Icon from "./Icon.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [term, setTerm] = useState(params.get("q") || "");
  const link = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  // keep the box in sync with the URL (cleared when you leave the search results)
  useEffect(() => {
    setTerm(params.get("q") || "");
  }, [params]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg site-nav">
      <div className="container">
        <Link className="navbar-brand brand" to="/">
          Inkwell<span className="brand-dot">.</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-label="Toggle menu"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className={link} to="/" end>
                All blogs
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink
                  className={link}
                  to={user.role === "admin" ? "/admin" : "/author"}
                >
                  {user.role === "admin" ? "Admin dashboard" : "My dashboard"}
                </NavLink>
              </li>
            )}
            {user && (
              <li className="nav-item">
                <NavLink className={link} to="/editor/new">
                  New blog
                </NavLink>
              </li>
            )}
          </ul>

          <form
            className="nav-search my-2 my-lg-0 me-lg-3"
            role="search"
            onSubmit={handleSearch}
          >
            <input
              type="search"
              className="form-control"
              placeholder="Search blogs"
              aria-label="Search blogs"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <button type="submit" aria-label="Search" title="Search">
              <Icon name="search" size={16} />
            </button>
          </form>

          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="profile-chip"
                  title="Edit your profile"
                >
                  <Avatar name={user.name} src={user.avatar} />
                  <span className="lh-sm">
                    <span className="d-block fw-semibold small">
                      {user.name}
                    </span>
                    <span className="d-block small text-body-secondary">
                      {user.role}
                    </span>
                  </span>
                </Link>
                <button
                  className="icon-btn"
                  onClick={handleLogout}
                  aria-label="Log out"
                  title="Log out"
                >
                  <Icon name="logout" />
                </button>
              </>
            ) : (
              <>
                <Link
                  className="icon-btn"
                  to="/login"
                  aria-label="Log in"
                  title="Log in"
                >
                  <Icon name="login" />
                </Link>
                <Link
                  className="icon-btn icon-btn-primary"
                  to="/register"
                  aria-label="Become an author"
                  title="Become an author"
                >
                  <Icon name="userPlus" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
