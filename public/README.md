# Image folders

public/
  images/            Images you add by hand (sample or default pictures)
    profiles/        e.g. /images/profiles/asha.jpg
    blogs/           e.g. /images/blogs/hampi.jpg
  uploads/           Images uploaded through the app (created automatically)
    profiles/        Profile pictures
    blogs/           Blog cover pictures

Anything inside `public/` is served from the site root, so
`public/images/blogs/hampi.jpg` is available at `/images/blogs/hampi.jpg`.
To use a hand-added image, paste that path into a blog's image URL field.
