const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const CATEGORIES = [
  "Technology",
  "Travel",
  "Food",
  "Lifestyle",
  "Education",
  "Health",
];

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export async function deleteBlogCascade(blogId) {
  const comments = await api.get(`/comments?blogId=${blogId}`);
  await Promise.all(comments.map((c) => api.del(`/comments/${c.id}`)));
  await api.del(`/blogs/${blogId}`);
}

export const CATEGORY_STYLES = {
  Technology: ["#3b4cca", "#8f9bff"],
  Travel: ["#0f7f86", "#6fd6c4"],
  Food: ["#c93d52", "#ff9b85"],
  Lifestyle: ["#7a3fb0", "#d6a2ff"],
  Education: ["#c77a00", "#ffd166"],
  Health: ["#2b8a3e", "#9be39b"],
};

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

export async function uploadImage(file, type) {
  let res;
  try {
    res = await fetch(`${BASE}/upload?type=${type}`, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
  } catch {
    throw new Error(
      "Could not reach the server. Start the app with npm start.",
    );
  }
  if (!res.ok) {
    let msg =
      "Upload failed. Restart the app with npm start so uploads are enabled.";
    try {
      msg = (await res.json()).error || msg;
    } catch {
      /* keep default */
    }
    throw new Error(msg);
  }
  const data = await res.json();
  return BASE + data.url;
}
