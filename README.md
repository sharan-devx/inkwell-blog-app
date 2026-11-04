# Inkwell: Blog app (React + JSON Server + Bootstrap 5)

## Run it
```bash
npm install
npm start        # starts JSON Server (3001) and Vite (5173) together
```
Open http://localhost:5173. Run `npm run server` and `npm run dev` separately if you prefer two terminals.

## Demo accounts
| Role   | Email          | Password |
|--------|----------------|----------|
| Admin  | admin@blog.com | admin123 |
| Author | asha@blog.com  | asha123  |
| Author | ravi@blog.com  | ravi123  |

## Roles
- **Visitor (user):** browse all blogs, filter by category and author, read details, add comments and ratings. No login needed.
- **Author:** register and log in, dashboard with own blogs, create/edit/delete, filter by category, read comments on blog details.
- **Admin:** log in, create/edit/delete any blog, filter by category and author, read and delete comments, block/unblock/delete authors.

## Structure
- `db.json`: users, blogs, comments
- `src/api.js`: fetch helpers and categories
- `src/AuthContext.jsx`: login, register, logout (session kept in localStorage)
- `src/components/`: Navbar, ProtectedRoute, BlogCard, BlogBrowser (filters)
- `src/pages/`: Home, BlogDetails, Login, Register, AuthorDashboard, AdminDashboard, BlogEditor

## Note
Passwords are stored in plain text and checked on the client. This is fine for a learning project with JSON Server, but a real app needs a backend that hashes passwords and issues tokens.

## Profiles, images and search
- **Profile page** (`/profile`, click your avatar in the navbar): change name, email, bio, profile picture and password.
- **Uploads:** pictures chosen in the app are saved by `upload-middleware.cjs` (loaded by `npm run server`) into `public/uploads/profiles/` and `public/uploads/blogs/`. Put your own images in `public/images/`. See `public/README.md`.
- **Search:** type in the navbar box and press Enter to search titles, content, categories and author names.
