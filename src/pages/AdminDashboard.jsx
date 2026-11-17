import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, deleteBlogCascade } from "../api.js";
import BlogBrowser from "../components/BlogBrowser.jsx";
import Stat from "../components/Stat.jsx";

export default function AdminDashboard() {
  const [tab, setTab] = useState("blogs");
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [counts, setCounts] = useState({});
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [b, a, c] = await Promise.all([
        api.get("/blogs?_sort=createdAt&_order=desc"),
        api.get("/users?role=author"),
        api.get("/comments"),
      ]);
      setBlogs(b);
      setAuthors(a);
      const map = {};
      c.forEach((x) => (map[x.blogId] = (map[x.blogId] || 0) + 1));
      setCounts(map);
    } catch {
      setError("Could not load data. Is JSON Server running on port 3001?");
    }
  };
  useEffect(() => {
    load();
  }, []);

  const removeBlog = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}" and its comments?`)) return;
    await deleteBlogCascade(blog.id);
    load();
  };

  const toggleBlock = async (a) => {
    await api.patch(`/users/${a.id}`, {
      status: a.status === "blocked" ? "active" : "blocked",
    });
    load();
  };

  const removeAuthor = async (a) => {
    if (
      !window.confirm(`Delete ${a.name} and all of their blogs and comments?`)
    )
      return;
    const theirs = blogs.filter((b) => b.authorId === a.id);
    for (const b of theirs) await deleteBlogCascade(b.id);
    await api.del(`/users/${a.id}`);
    load();
  };

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h2 mb-0">Admin dashboard</h1>
        <Link to="/editor/new" className="btn btn-success">
          New blog
        </Link>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-4 col-md-3">
          <Stat label="Blogs" value={blogs.length} />
        </div>
        <div className="col-4 col-md-3">
          <Stat label="Authors" value={authors.length} />
        </div>
        <div className="col-4 col-md-3">
          <Stat
            label="Comments"
            value={Object.values(counts).reduce((a, b) => a + b, 0)}
          />
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={"nav-link" + (tab === "blogs" ? " active" : "")}
            onClick={() => setTab("blogs")}
          >
            All blogs
          </button>
        </li>
        <li className="nav-item">
          <button
            className={"nav-link" + (tab === "authors" ? " active" : "")}
            onClick={() => setTab("authors")}
          >
            Authors
          </button>
        </li>
      </ul>

      {tab === "blogs" && (
        <BlogBrowser
          blogs={blogs}
          authors={authors}
          counts={counts}
          showAuthorFilter
          renderActions={(b) => (
            <>
              <Link
                to={`/editor/${b.id}`}
                className="btn btn-sm btn-outline-primary"
              >
                Edit
              </Link>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeBlog(b)}
              >
                Delete
              </button>
            </>
          )}
        />
      )}

      {tab === "authors" && (
        <div className="table-wrap table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Blogs</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td>{blogs.filter((b) => b.authorId === a.id).length}</td>
                  <td>
                    <span
                      className={
                        "badge " +
                        (a.status === "blocked"
                          ? "text-bg-danger"
                          : "text-bg-success")
                      }
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => toggleBlock(a)}
                    >
                      {a.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeAuthor(a)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {authors.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-body-secondary">
                    No authors registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
