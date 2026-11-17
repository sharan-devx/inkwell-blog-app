import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, fmtDate, initials, CATEGORY_STYLES } from "../api.js";
import Cover from "../components/Cover.jsx";
import Avatar from "../components/Avatar.jsx";
import { useAuth } from "../AuthContext.jsx";

const Stars = ({ n }) => (
  <span className="star" aria-label={`${n} out of 5`}>
    {"★".repeat(n)}
    {"☆".repeat(5 - n)}
  </span>
);

export default function BlogDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    rating: 5,
    text: "",
  });

  const loadComments = () =>
    api
      .get(`/comments?blogId=${id}&_sort=createdAt&_order=desc`)
      .then(setComments);

  useEffect(() => {
    api
      .get(`/blogs/${id}`)
      .then(async (b) => {
        setBlog(b);
        const a = await api.get(`/users/${b.authorId}`).catch(() => null);
        setAuthor(a);
        await loadComments();
      })
      .catch(() => setError("This blog could not be found."));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    await api.post("/comments", {
      blogId: Number(id),
      name: form.name.trim(),
      rating: Number(form.rating),
      text: form.text.trim(),
      createdAt: new Date().toISOString(),
    });
    setForm({ ...form, text: "", rating: 5 });
    loadComments();
  };

  const removeComment = async (cid) => {
    if (!window.confirm("Delete this comment?")) return;
    await api.del(`/comments/${cid}`);
    loadComments();
  };

  if (error)
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  if (!blog)
    return (
      <div className="container py-4">
        <div className="spinner-border text-success" />
      </div>
    );

  const avg = comments.length
    ? (comments.reduce((s, c) => s + c.rating, 0) / comments.length).toFixed(1)
    : null;
  const catColor = (CATEGORY_STYLES[blog.category] ||
    CATEGORY_STYLES.Technology)[0];

  return (
    <main className="container py-4 article-wrap">
      <Link to="/" className="back-link">
        Back to all blogs
      </Link>
      <div className="mt-4">
        <span className="chip chip-solid" style={{ background: catColor }}>
          {blog.category}
        </span>
      </div>
      <h1 className="article-title">{blog.title}</h1>
      <div className="byline">
        <Avatar name={author?.name} src={author?.avatar} />
        <div className="lh-sm">
          <div className="fw-semibold">{author?.name || "Unknown author"}</div>
          <div className="small text-body-secondary">
            {fmtDate(blog.createdAt)}
            {avg && (
              <>
                , rated {avg}/5 by {comments.length} reader
                {comments.length === 1 ? "" : "s"}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-4 overflow-hidden mb-4">
        <Cover blog={blog} height={blog.imageUrl ? 340 : 130} />
      </div>
      <article className="article-body mb-5">{blog.content}</article>

      <h2 className="h4 mb-3">Comments ({comments.length})</h2>
      <form onSubmit={submit} className="card card-body mb-4">
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label">Your name</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Rating</label>
            <select
              className="form-select"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 && "s"}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Comment</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <button className="btn btn-success">Post comment</button>
          </div>
        </div>
      </form>

      {comments.length === 0 && (
        <p className="text-body-secondary">
          No comments yet. Be the first to share a thought.
        </p>
      )}
      {comments.map((c) => (
        <div key={c.id} className="comment">
          <div className="d-flex align-items-center gap-2 mb-1">
            <Avatar name={c.name} size={26} />
            <strong>{c.name}</strong>
            <span className="ms-auto small text-body-secondary">
              {fmtDate(c.createdAt)}
            </span>
          </div>
          <Stars n={c.rating} />
          <p className="mb-1 mt-1">{c.text}</p>
          {user?.role === "admin" && (
            <button
              className="btn btn-link btn-sm text-danger p-0"
              onClick={() => removeComment(c.id)}
            >
              Delete comment
            </button>
          )}
        </div>
      ))}
    </main>
  );
}
