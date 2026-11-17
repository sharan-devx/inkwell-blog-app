import { useRef, useState } from "react";
import { uploadImage } from "../api.js";
import Icon from "./Icon.jsx";

const MAX_BYTES = 5 * 1024 * 1024;

export default function ImageUpload({
  value,
  onChange,
  type,
  round = false,
  fallback = null,
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    if (
      !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
        file.type,
      )
    ) {
      return setError("Choose a PNG, JPG, WEBP or GIF image.");
    }
    if (file.size > MAX_BYTES) return setError("Image must be under 5 MB.");
    setBusy(true);
    try {
      onChange(await uploadImage(file, type));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="d-flex align-items-center gap-3 flex-wrap">
      {value ? (
        <img
          src={value}
          alt="Preview"
          className={round ? "upload-round" : "upload-wide"}
        />
      ) : (
        fallback || (
          <div
            className={
              (round ? "upload-round" : "upload-wide") + " upload-empty"
            }
          >
            No image
          </div>
        )
      )}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          hidden
          onChange={pick}
        />
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2"
            disabled={busy}
            onClick={() => inputRef.current.click()}
          >
            <Icon name="camera" size={16} />{" "}
            {busy ? "Uploading…" : value ? "Change" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-2"
              disabled={busy}
              onClick={() => onChange("")}
            >
              <Icon name="trash" size={16} /> Remove
            </button>
          )}
        </div>
        <div className="small text-body-secondary mt-2">
          PNG, JPG, WEBP or GIF, up to 5 MB.
        </div>
        {error && <div className="small text-danger mt-1">{error}</div>}
      </div>
    </div>
  );
}
