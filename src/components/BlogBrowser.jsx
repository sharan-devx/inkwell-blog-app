import { useState } from "react";
import BlogCard from "./BlogCard.jsx";
import { CATEGORIES } from "../api.js";

// Filterable grid of blogs. Pass showAuthorFilter to enable the author filter, query for text search.
export default function BlogBrowser({
  blogs,
  authors = [],
  showAuthorFilter = false,
  query = "",
  counts,
  renderActions,
}) {
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");

  const authorOf = (id) => authors.find((a) => a.id === id);
  const q = query.trim().toLowerCase();
  const matchesQuery = (b) =>
    !q ||
    [b.title, b.content, b.category, authorOf(b.authorId)?.name || ""].some(
      (t) => t.toLowerCase().includes(q),
    );

  const filtered = blogs.filter(
    (b) =>
      (!category || b.category === category) &&
      (!author || b.authorId === Number(author)) &&
      matchesQuery(b),
  );

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        {["", ...CATEGORIES].map((c) => (
          <button
            key={c || "all"}
            type="button"
            className={"pill" + (category === c ? " active" : "")}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c || "All"}
          </button>
        ))}
        {showAuthorFilter && (
          <select
            className="form-select w-auto ms-md-auto"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            aria-label="Filter by author"
          >
            <option value="">All authors</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-light border">
          No blogs match your search or filters.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filtered.map((b) => (
            <div className="col" key={b.id}>
              <BlogCard
                blog={b}
                author={authorOf(b.authorId)}
                commentCount={counts ? counts[b.id] || 0 : undefined}
                actions={renderActions?.(b)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
