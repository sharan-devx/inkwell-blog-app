import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, CATEGORIES } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import ImageUpload from "../components/ImageUpload.jsx";

export default function BlogEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const back = user.role === "admin" ? "/admin" : "/author";

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    imageUrl: "",
    content: "",
    authorId: user.role === "author" ? user.id : "",
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (user.role === "admin") api.get("/users?role=author").then(setAuthors);
    if (id) {
      api.get(`/blogs/${id}`)
        .then((b) => {
          if (user.role === "author" && b.authorId !== user.id) return navigate("/author");
          setForm({ title: b.title, category: b.category, imageUrl: b.imageUrl || "", content: b.content, authorId: b.authorId });
        })
        .catch(() => setError("Blog not found."))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.authorId) return setError("Choose an author for this blog.");
    const payload = {
      title: form.title.trim(),
      category: form.category,
      imageUrl: form.imageUrl.trim(),
      content: form.content.trim(),
      authorId: Number(form.authorId),
    };
    try {
      if (id) await api.patch(`/blogs/${id}`, { ...payload, updatedAt: new Date().toISOString() });
      else await api.post("/blogs", { ...payload, createdAt: new Date().toISOString() });
      navigate(back);
    } catch {
      setError("Could not save the blog. Check that JSON Server is running.");
    }
  };

  if (loading) return <div className="container py-4"><div className="spinner-border text-success" /></div>;

  return (
    <main className="container py-4" style={{ maxWidth: 760 }}>
      <h1 className="h2 mb-4">{id ? "Edit blog" : "Write a new blog"}</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} className="card card-body p-4">
        <label className="form-label">Title</label>
        <input className="form-control mb-3" value={form.title} onChange={set("title")} required />

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          {user.role === "admin" && (
            <div className="col-md-6 mb-3">
              <label className="form-label">Author</label>
              <select className="form-select" value={form.authorId} onChange={set("authorId")} required>
                <option value="">Select an author</option>
                {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          )}
        </div>

        <label className="form-label">Cover image (optional)</label>
        <div className="mb-3">
          <ImageUpload type="blogs" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          <input className="form-control mt-3" value={form.imageUrl} onChange={set("imageUrl")} placeholder="Or paste an image URL or a path such as /images/blogs/photo.jpg" />
        </div>

        <label className="form-label">Content</label>
        <textarea className="form-control mb-3" rows="10" value={form.content} onChange={set("content")} required />

        <div className="d-flex gap-2">
          <button className="btn btn-success">{id ? "Save changes" : "Publish blog"}</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(back)}>Cancel</button>
        </div>
      </form>
    </main>
  );
}
