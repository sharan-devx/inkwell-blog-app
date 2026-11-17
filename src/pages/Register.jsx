import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    try {
      await register(form);
      navigate("/author");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container py-5 auth-wrap">
      <h1 className="h2 mb-4">Create an author account</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} className="card card-body p-4">
        <label className="form-label">Full name</label>
        <input
          className="form-control mb-3"
          value={form.name}
          onChange={set("name")}
          required
        />
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control mb-3"
          value={form.email}
          onChange={set("email")}
          required
        />
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control mb-3"
          value={form.password}
          onChange={set("password")}
          required
        />
        <label className="form-label">Short bio (optional)</label>
        <textarea
          className="form-control mb-3"
          rows="2"
          value={form.bio}
          onChange={set("bio")}
        />
        <button className="btn btn-success">Register</button>
      </form>
      <p className="mt-3 small">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}
