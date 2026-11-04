import { Link } from "react-router-dom";
import { fmtDate } from "../api.js";
import Avatar from "./Avatar.jsx";
import Cover from "./Cover.jsx";

export default function BlogCard({ blog, author, commentCount, actions }) {
  const excerpt = blog.content.length > 120 ? blog.content.slice(0, 120).trim() + "…" : blog.content;
  return (
    <div className="card blog-card h-100">
      <Cover blog={blog}>
        <span className="chip">{blog.category}</span>
      </Cover>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title"><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></h5>
        <p className="card-text text-body-secondary small flex-grow-1">{excerpt}</p>
        <div className="blog-meta d-flex align-items-center gap-2 pt-3 small text-body-secondary">
          {author && (
            <>
              <Avatar name={author.name} src={author.avatar} size={26} />
              <span className="fw-semibold text-body">{author.name}</span>
            </>
          )}
          <span className="ms-auto">
            {fmtDate(blog.createdAt)}
            {commentCount !== undefined && <>, {commentCount} comment{commentCount === 1 ? "" : "s"}</>}
          </span>
        </div>
        {actions && <div className="d-flex flex-wrap gap-2 mt-3">{actions}</div>}
      </div>
    </div>
  );
}
