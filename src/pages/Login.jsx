import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const u = await login(form.email, form.password);
      navigate(u.role === "admin" ? "/admin" : "/author");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container py-5 auth-wrap">
      <h1 className="h2 mb-4">Log in</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} className="card card-body p-4">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn btn-success">Log in</button>
      </form>
      <p className="mt-3 small">
        New here? <Link to="/register">Register as an author</Link>
      </p>
      <p className="small text-body-secondary">
        Demo accounts: admin@blog.com / admin123, asha@blog.com / asha123
      </p>
    </main>
  );
}
