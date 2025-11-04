// API Helper Functions
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api';

// Currency state
let currentCurrency = localStorage.getItem('currency') || 'INR';
const USD_TO_INR = 83;

// Format currency to Indian Rupees
function formatCurrencyINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Format currency to USD
function formatCurrencyUSD(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(amount);
}

// Format currency based on current selection
function formatCurrency(amount, currency = null) {
    const curr = currency || currentCurrency;
    if (curr === 'USD') {
        return formatCurrencyUSD(amount);
    }
    return formatCurrencyINR(amount);
}

// Get gross amount based on currency
function getGrossAmount(movie, currency = null) {
    const curr = currency || currentCurrency;
    if (curr === 'USD') {
        return movie.worldwide_gross_usd || movie.worldwideGross || 0;
    }
    return movie.worldwide_gross_inr || movie.worldwideGross || 0;
}

// Set currency preference
function setCurrency(currency) {
    currentCurrency = currency;
    localStorage.setItem('currency', currency);
    // Trigger custom event for other scripts
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: currency }));
}

// Get currency preference
function getCurrency() {
    return currentCurrency;
}

// Fetch all movies
async function fetchMovies() {
    try {
        const url = `${API_BASE_URL}/movies`;
        console.log('Fetching all movies from:', url);
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error(`Failed to fetch movies: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Movies received:', data.length);
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

// Fetch movie by ID
async function fetchMovieById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/${id}`);
        if (!response.ok) throw new Error('Failed to fetch movie');
        return await response.json();
    } catch (error) {
        console.error('Error fetching movie:', error);
        return null;
    }
}

// Fetch movies by category
async function fetchMoviesByCategory(category) {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/categories/${category}`);
        if (!response.ok) throw new Error('Failed to fetch movies');
        return await response.json();
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

// Fetch top 10 movies
async function fetchTop10() {
    try {
        const url = `${API_BASE_URL}/movies/top10`;
        console.log('Fetching from:', url);
        const response = await fetch(url);
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error(`Failed to fetch top 10: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Top 10 movies received:', data.length);
        return data;
    } catch (error) {
        console.error('Error fetching top 10:', error);
        return [];
    }
}

// Add new movie
async function addMovie(movieData) {
    try {
        const response = await fetch(`${API_BASE_URL}/movies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieData)
        });
        if (!response.ok) throw new Error('Failed to add movie');
        return await response.json();
    } catch (error) {
        console.error('Error adding movie:', error);
        throw error;
    }
}

// Update movie
async function updateMovie(id, movieData) {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieData)
        });
        if (!response.ok) throw new Error('Failed to update movie');
        return await response.json();
    } catch (error) {
        console.error('Error updating movie:', error);
        throw error;
    }
}

// Delete movie
async function deleteMovie(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete movie');
        return await response.json();
    } catch (error) {
        console.error('Error deleting movie:', error);
        throw error;
    }
}

// Submit contact form
async function submitContact(name, email, message) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });
        if (!response.ok) throw new Error('Failed to submit contact');
        return await response.json();
    } catch (error) {
        console.error('Error submitting contact:', error);
        throw error;
    }
}

// Fetch contact messages (admin only)
async function fetchContacts() {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`);
        if (!response.ok) throw new Error('Failed to fetch contacts');
        return await response.json();
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return [];
    }
}

// Admin login
async function adminLogin(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('adminToken', data.token);
            return data;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

// Fetch statistics
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return await response.json();
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
}

// Fetch industry statistics
async function fetchIndustryStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats/industries`);
        if (!response.ok) throw new Error('Failed to fetch industry stats');
        return await response.json();
    } catch (error) {
        console.error('Error fetching industry stats:', error);
        return [];
    }
}
