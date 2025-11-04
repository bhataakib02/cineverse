# 🚀 Quick Start Guide

Get CineVerse up and running in 3 simple steps!

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Express.js (backend framework)
- CORS (Cross-Origin Resource Sharing)
- Body Parser (request parsing)
- And other dependencies

## Step 2: Start the Server

```bash
npm start
```

You should see:
```
🎬 CineVerse server running on http://localhost:3000
```

## Step 3: Open in Browser

Navigate to:
```
http://localhost:3000
```

## That's it! 🎉

You now have CineVerse running locally. You can:

- ✅ Browse all movies
- ✅ View movie details
- ✅ Filter by category (Hollywood, Bollywood, Tollywood)
- ✅ Search movies
- ✅ View Top 10 box office
- ✅ Use admin panel (login: admin/admin123)

## Troubleshooting

**Port 3000 already in use?**
```bash
# Set a different port
PORT=3001 npm start
```

**Dependencies not installing?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Movies not showing?**
- Check that `backend/data/movies.json` exists
- Verify server is running
- Check browser console for errors

## Next Steps

1. Explore the admin panel to add more movies
2. Customize colors in `frontend/css/style.css`
3. Add your own movie data to `backend/data/movies.json`

---

Happy coding! 🎬✨



