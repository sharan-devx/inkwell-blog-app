import { initials } from "../api.js";

// Profile picture if there is one, otherwise the person's initials
export default function Avatar({ name, src, size = 34 }) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.36) };
  if (src) return <img className="avatar avatar-img" src={src} alt="" style={style} />;
  return <span className="avatar" style={style}>{initials(name)}</span>;
}
