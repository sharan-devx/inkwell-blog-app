import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, fmtDate } from "../api.js";
import BlogBrowser from "../components/BlogBrowser.jsx";
import Cover from "../components/Cover.jsx";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  useEffect(() => {
    Promise.all([api.get("/blogs?_sort=createdAt&_order=desc"), api.get("/users?role=author")])
      .then(([b, a]) => {
        setBlogs(b);
        setAuthors(a.map(({ password, ...rest }) => rest));
      })
      .catch(() => setError("Could not load blogs. Is JSON Server running on port 3001?"))
      .finally(() => setLoading(false));
  }, []);

  const latest = blogs[0];
  const latestAuthor = authors.find((a) => a.id === latest?.authorId)?.name;

  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <h1>Good writing from people who know their subject.</h1>
              <p className="mt-3 mb-0">
                {blogs.length} stories by {authors.length} authors. Pick a category, follow an author, and join the conversation in the comments.
              </p>
            </div>
            <div className="col-lg-5">
              {latest && (
                <Link to={`/blogs/${latest.id}`} className="feature">
                  <Cover blog={latest} height={150}>
                    <span className="chip">Latest: {latest.category}</span>
                  </Cover>
                  <div className="feature-body">
                    <h2>{latest.title}</h2>
                    <div className="small text-body-secondary">
                      {latestAuthor && <>By {latestAuthor}, </>}{fmtDate(latest.createdAt)}
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container py-5">
        {loading && <div className="spinner-border text-success" role="status" />}
        {error && <div className="alert alert-danger">{error}</div>}
        {q && (
          <p className="text-body-secondary mb-3">
            Results for “{q}”. <Link to="/">Clear search</Link>
          </p>
        )}
        {!loading && !error && <BlogBrowser blogs={blogs} authors={authors} showAuthorFilter query={q} />}
      </main>
    </>
  );
}
