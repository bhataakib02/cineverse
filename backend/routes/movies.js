const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/movies.json');

// Helper function to read movies
function readMovies() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write movies
function writeMovies(movies) {
  fs.writeFileSync(dataPath, JSON.stringify(movies, null, 2));
}

// GET all movies
router.get('/', (req, res) => {
  const movies = readMovies();
  res.json(movies);
});

// GET top 10 movies by worldwide gross (MUST come before /:id)
router.get('/top10', (req, res) => {
  try {
    const movies = readMovies();
    if (!movies || movies.length === 0) {
      return res.json([]);
    }
    const sorted = movies
      .filter(m => m && (m.worldwide_gross_usd || m.worldwideGross))
      .sort((a, b) => {
        const grossA = a.worldwide_gross_usd || a.worldwideGross || 0;
        const grossB = b.worldwide_gross_usd || b.worldwideGross || 0;
        return grossB - grossA;
      })
      .slice(0, 10);
    res.json(sorted);
  } catch (error) {
    console.error('Error fetching top 10:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET movies by category (MUST come before /:id)
router.get('/category/:category', (req, res) => {
  const movies = readMovies();
  const category = req.params.category;
  const filtered = movies.filter(m => 
    m.category && m.category.toLowerCase() === category.toLowerCase()
  );
  res.json(filtered);
});

// Alternative route for categories (MUST come before /:id)
router.get('/categories/:category', (req, res) => {
  const movies = readMovies();
  const category = req.params.category;
  const filtered = movies.filter(m => 
    m.category && m.category.toLowerCase() === category.toLowerCase()
  );
  res.json(filtered);
});

// GET movie by ID (MUST come last)
router.get('/:id', (req, res) => {
  const movies = readMovies();
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

// POST add new movie
router.post('/', (req, res) => {
  const movies = readMovies();
  const newMovie = {
    id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  movies.push(newMovie);
  writeMovies(movies);
  res.status(201).json(newMovie);
});

// PUT update movie
router.put('/:id', (req, res) => {
  const movies = readMovies();
  const index = movies.findIndex(m => m.id === parseInt(req.params.id));
  if (index !== -1) {
    movies[index] = { ...movies[index], ...req.body, updatedAt: new Date().toISOString() };
    writeMovies(movies);
    res.json(movies[index]);
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

// DELETE movie
router.delete('/:id', (req, res) => {
  const movies = readMovies();
  const filtered = movies.filter(m => m.id !== parseInt(req.params.id));
  if (filtered.length < movies.length) {
    writeMovies(filtered);
    res.json({ message: 'Movie deleted successfully' });
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});


module.exports = router;

