// API Helper Functions
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api';

// Currency state
let currentCurrency = localStorage.getItem('currency') || 'INR';
const USD_TO_INR = 83;

// Format currency to Indian Rupees (with Crores/Lakhs)
function formatCurrencyINR(amount) {
    if (!amount || amount === 0) return '₹0';
    
    // Convert to crores for better readability
    if (amount >= 10000000) { // 1 crore = 10,000,000
        const crores = amount / 10000000;
        if (crores >= 100) {
            return `₹${crores.toFixed(1)} Cr`;
        } else if (crores >= 1) {
            return `₹${crores.toFixed(2)} Cr`;
        }
    }
    
    // Convert to lakhs for amounts between 1 lakh and 1 crore
    if (amount >= 100000) { // 1 lakh = 100,000
        const lakhs = amount / 100000;
        return `₹${lakhs.toFixed(1)} L`;
    }
    
    // For smaller amounts, use standard formatting with commas
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Format currency to USD (with Millions/Billions)
function formatCurrencyUSD(amount) {
    if (!amount || amount === 0) return '$0';
    
    // Convert to billions for very large amounts
    if (amount >= 1000000000) { // 1 billion = 1,000,000,000
        const billions = amount / 1000000000;
        return `$${billions.toFixed(2)}B`;
    }
    
    // Convert to millions for large amounts
    if (amount >= 1000000) { // 1 million = 1,000,000
        const millions = amount / 1000000;
        return `$${millions.toFixed(2)}M`;
    }
    
    // For smaller amounts, use standard formatting with commas
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(amount);
}

// Format currency based on current selection
function formatCurrency(amount, currency = null) {
    const curr = currency || currentCurrency;
    if (!amount || amount === 0 || isNaN(amount)) {
        return curr === 'USD' ? '$0' : '₹0';
    }
    if (curr === 'USD') {
        return formatCurrencyUSD(amount);
    }
    return formatCurrencyINR(amount);
}

// Get gross amount based on currency
function getGrossAmount(movie, currency = null) {
    if (!movie) return 0;
    const curr = currency || currentCurrency;
    if (curr === 'USD') {
        return movie.worldwide_gross_usd || movie.worldwideGross || (movie.worldwide_gross_inr ? movie.worldwide_gross_inr / 83 : 0) || 0;
    }
    // For INR, prioritize INR value, then convert USD if available
    return movie.worldwide_gross_inr || (movie.worldwide_gross_usd ? movie.worldwide_gross_usd * 83 : 0) || movie.worldwideGross || 0;
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
        console.log('Fetching movie by ID:', id);
        console.log('API URL:', `${API_BASE_URL}/movies/${id}`);
        const response = await fetch(`${API_BASE_URL}/movies/${id}`);
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error(`Failed to fetch movie: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Movie data received:', data ? data.title : 'null');
        return data;
    } catch (error) {
        console.error('Error fetching movie:', error);
        console.error('Error details:', error.message);
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
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            cache: 'no-cache'
        });
        
        console.log('Response status:', response.status, response.statusText);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error(`Failed to fetch top 10: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Top 10 movies received:', data.length);
        console.log('Data type:', Array.isArray(data) ? 'Array' : typeof data);
        
        if (Array.isArray(data) && data.length > 0) {
            console.log('First movie sample:', {
                id: data[0].id,
                title: data[0].title,
                gross_usd: data[0].worldwide_gross_usd,
                gross_inr: data[0].worldwide_gross_inr
            });
        }
        
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching top 10:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // If it's a network error, show helpful message
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            console.error('Network error - is the server running?');
        }
        
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
