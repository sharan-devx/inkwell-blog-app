import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";
import ImageUpload from "../components/ImageUpload.jsx";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || "",
    avatar: user.avatar || "",
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [msg, setMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      if (form.email !== user.email) {
        const taken = await api.get(`/users?email=${encodeURIComponent(form.email)}`);
        if (taken.some((u) => u.id !== user.id)) throw new Error("That email is already used by another account.");
      }
      await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar,
      });
      setMsg({ type: "success", text: "Profile saved." });
    } catch (err) {
      setMsg({ type: "danger", text: err.message });
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    try {
      if (pw.next.length < 6) throw new Error("The new password must be at least 6 characters.");
      if (pw.next !== pw.confirm) throw new Error("The new passwords do not match.");
      const current = await api.get(`/users/${user.id}`);
      if (current.password !== pw.current) throw new Error("Your current password is incorrect.");
      await api.patch(`/users/${user.id}`, { password: pw.next });
      setPw({ current: "", next: "", confirm: "" });
      setPwMsg({ type: "success", text: "Password updated." });
    } catch (err) {
      setPwMsg({ type: "danger", text: err.message });
    }
  };

  return (
    <main className="container py-4" style={{ maxWidth: 760 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Your profile</h1>
        <Link to={user.role === "admin" ? "/admin" : "/author"} className="btn btn-outline-dark btn-sm">Back to dashboard</Link>
      </div>

      <form onSubmit={saveProfile} className="card card-body p-4 mb-4">
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <label className="form-label">Profile picture</label>
        <div className="mb-3">
          <ImageUpload
            type="profiles"
            round
            value={form.avatar}
            onChange={(url) => setForm((f) => ({ ...f, avatar: url }))}
            fallback={<Avatar name={form.name} size={96} />}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Full name</label>
            <input className="form-control" value={form.name} onChange={set("name")} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={form.email} onChange={set("email")} required />
          </div>
        </div>

        <label className="form-label">Bio</label>
        <textarea className="form-control mb-3" rows="3" value={form.bio} onChange={set("bio")} placeholder="Tell readers a little about yourself" />

        <div><button className="btn btn-success">Save profile</button></div>
      </form>

      <form onSubmit={changePassword} className="card card-body p-4">
        <h2 className="h5 mb-3">Change password</h2>
        {pwMsg && <div className={`alert alert-${pwMsg.type}`}>{pwMsg.text}</div>}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Current password</label>
            <input type="password" className="form-control" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">New password</label>
            <input type="password" className="form-control" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Confirm new password</label>
            <input type="password" className="form-control" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required />
          </div>
        </div>
        <div><button className="btn btn-outline-dark">Update password</button></div>
      </form>
    </main>
  );
}
