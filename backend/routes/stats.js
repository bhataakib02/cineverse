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

// GET /api/stats - Summary statistics
router.get('/', (req, res) => {
  try {
    const movies = readMovies();
    
    const totalMovies = movies.length;
    const totalRevenueUSD = movies.reduce((sum, m) => sum + (m.worldwide_gross_usd || 0), 0);
    const totalRevenueINR = movies.reduce((sum, m) => sum + (m.worldwide_gross_inr || 0), 0);
    const avgRating = movies.reduce((sum, m) => sum + (m.imdb_rating || 0), 0) / totalMovies;
    const totalBudgetUSD = movies.reduce((sum, m) => sum + (m.budget_usd || 0), 0);
    const totalBudgetINR = movies.reduce((sum, m) => sum + (m.budget_inr || (m.budget_usd || 0) * 83), 0);
    
    // Industry breakdown
    const industries = {
      Hollywood: movies.filter(m => m.category === 'Hollywood').length,
      Bollywood: movies.filter(m => m.category === 'Bollywood').length,
      Tollywood: movies.filter(m => m.category === 'Tollywood').length
    };
    
    // Year range
    const years = movies.map(m => m.year).filter(y => y);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    res.json({
      totalMovies,
      totalRevenueUSD,
      totalRevenueINR,
      avgRating: avgRating.toFixed(2),
      totalBudgetUSD,
      totalBudgetINR,
      industries,
      yearRange: { min: minYear, max: maxYear }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/stats/industries - Industry comparison data
router.get('/industries', (req, res) => {
  try {
    const movies = readMovies();
    
    const industries = ['Hollywood', 'Bollywood', 'Tollywood'];
    const industryData = industries.map(industry => {
      const industryMovies = movies.filter(m => m.category === industry);
      const revenueUSD = industryMovies.reduce((sum, m) => sum + (m.worldwide_gross_usd || 0), 0);
      const revenueINR = industryMovies.reduce((sum, m) => sum + (m.worldwide_gross_inr || 0), 0);
      const avgRating = industryMovies.length > 0
        ? industryMovies.reduce((sum, m) => sum + (m.imdb_rating || 0), 0) / industryMovies.length
        : 0;
      
      return {
        industry,
        count: industryMovies.length,
        revenueUSD,
        revenueINR,
        avgRating: avgRating.toFixed(2)
      };
    });
    
    res.json(industryData);
  } catch (error) {
    console.error('Error fetching industry stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

