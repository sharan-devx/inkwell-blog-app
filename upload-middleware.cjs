// Adds POST /upload?type=profiles|blogs to JSON Server.
// The request body is the raw image file; it is saved to public/uploads/<type>/.
const fs = require("fs");
const path = require("path");

const FOLDERS = ["profiles", "blogs"];
const EXT = { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp", "image/gif": ".gif" };
const MAX_BYTES = 5 * 1024 * 1024;

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

module.exports = (req, res, next) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method !== "POST" || url.pathname !== "/upload") return next();

  const folder = url.searchParams.get("type");
  const ext = EXT[(req.headers["content-type"] || "").split(";")[0]];
  if (!FOLDERS.includes(folder)) return send(res, 400, { error: "Unknown upload type." });
  if (!ext) return send(res, 400, { error: "Only PNG, JPG, WEBP or GIF images are allowed." });

  const chunks = [];
  let size = 0;
  req.on("data", (c) => {
    size += c.length;
    if (size <= MAX_BYTES) chunks.push(c);
  });
  req.on("end", () => {
    if (size > MAX_BYTES) return send(res, 413, { error: "Image must be under 5 MB." });
    if (!size) return send(res, 400, { error: "The file was empty." });
    const dir = path.join(__dirname, "public", "uploads", folder);
    fs.mkdirSync(dir, { recursive: true });
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    fs.writeFile(path.join(dir, name), Buffer.concat(chunks), (err) =>
      err
        ? send(res, 500, { error: "Could not save the file." })
        : send(res, 201, { url: `/uploads/${folder}/${name}` })
    );
  });
};
