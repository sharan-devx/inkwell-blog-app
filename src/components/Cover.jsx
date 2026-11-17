import { CATEGORY_STYLES } from "../api.js";

// Image if the blog has one, otherwise a category-coloured block with the title's first letter
export default function Cover({ blog, height = 150, children }) {
  if (blog.imageUrl) {
    return (
      <div className="cover" style={{ height }}>
        <img src={blog.imageUrl} alt="" />
        {children}
      </div>
    );
  }
  const [bg, fg] = CATEGORY_STYLES[blog.category] || CATEGORY_STYLES.Technology;
  return (
    <div className="cover" style={{ height, background: bg }}>
      <span
        className="cover-letter"
        style={{ color: fg, fontSize: height * 1.1 }}
        aria-hidden="true"
      >
        {blog.title.charAt(0).toUpperCase()}
      </span>
      {children}
    </div>
  );
}
