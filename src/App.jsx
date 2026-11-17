import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import BlogDetails from "./pages/BlogDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AuthorDashboard from "./pages/AuthorDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import BlogEditor from "./pages/BlogEditor.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/author"
          element={
            <ProtectedRoute roles={["author"]}>
              <AuthorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["author", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/new"
          element={
            <ProtectedRoute roles={["author", "admin"]}>
              <BlogEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute roles={["author", "admin"]}>
              <BlogEditor />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <footer className="site-footer">
        <div className="container">
          Inkwell, a small blog platform built with React, JSON Server and
          Bootstrap.
        </div>
      </footer>
    </>
  );
}
