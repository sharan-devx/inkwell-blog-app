import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, deleteBlogCascade } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import BlogBrowser from "../components/BlogBrowser.jsx";
import Stat from "../components/Stat.jsx";

export default function AuthorDashboard() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [counts, setCounts] = useState({});
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const mine = await api.get(
        `/blogs?authorId=${user.id}&_sort=createdAt&_order=desc`,
      );
      setBlogs(mine);
      const all = await api.get("/comments");
      const map = {};
      all.forEach((c) => (map[c.blogId] = (map[c.blogId] || 0) + 1));
      setCounts(map);
    } catch {
      setError(
        "Could not load your blogs. Is JSON Server running on port 3001?",
      );
    }
  };
  useEffect(() => {
    load();
  }, []);

  const remove = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}" and its comments?`)) return;
    await deleteBlogCascade(blog.id);
    load();
  };

  const totalComments = blogs.reduce((s, b) => s + (counts[b.id] || 0), 0);

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h2 mb-0">Welcome, {user.name}</h1>
        <Link to="/editor/new" className="btn btn-success">
          New blog
        </Link>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <Stat label="Blogs written" value={blogs.length} />
        </div>
        <div className="col-6 col-md-3">
          <Stat label="Comments received" value={totalComments} />
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {blogs.length === 0 && !error ? (
        <div className="alert alert-light border">
          You have not written anything yet. Start with your first blog.
        </div>
      ) : (
        <BlogBrowser
          blogs={blogs}
          counts={counts}
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
                onClick={() => remove(b)}
              >
                Delete
              </button>
            </>
          )}
        />
      )}
    </main>
  );
}
