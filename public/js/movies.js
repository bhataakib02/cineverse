// Movies page JavaScript

let allMovies = [];
let currentPage = 1;
const moviesPerPage = 12;

// Load movies on page load
async function loadMovies() {
    console.log('loadMovies() called');
    const container = document.getElementById('movies-container');
    if (!container) {
        console.error('Movies container not found!');
        return;
    }
    
    // Show loading state
    container.innerHTML = '<div style="text-align: center; padding: 4rem; grid-column: 1 / -1;"><p style="color: var(--text-secondary);">Loading movies...</p></div>';
    
    try {
        console.log('Fetching movies from API...');
        allMovies = await fetchMovies();
        console.log('Movies fetched:', allMovies.length);
        
        if (!allMovies || allMovies.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 4rem; grid-column: 1 / -1;"><p style="color: var(--text-secondary);">No movies found.</p></div>';
            return;
        }
        
        displayMovies(allMovies);
        setupFilters(allMovies);
        setupPagination(allMovies);
        console.log('Movies displayed successfully');
    } catch (error) {
        console.error('Error loading movies:', error);
        if (container) {
            container.innerHTML = 
                '<div style="text-align: center; padding: 4rem; grid-column: 1 / -1;"><p style="color: var(--text-secondary);">Error loading movies. Please check console for details.</p><button class="btn btn-primary" onclick="loadMovies()">Retry</button></div>';
        }
    }
}

// Display movies with pagination
function displayMovies(movies, page = 1) {
    console.log('displayMovies() called with', movies.length, 'movies, page', page);
    const container = document.getElementById('movies-container');
    if (!container) {
        console.error('Movies container not found in displayMovies!');
        return;
    }

    if (!movies || movies.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 4rem; grid-column: 1 / -1;"><p style="color: var(--text-secondary);">No movies to display.</p></div>';
        return;
    }

    const start = (page - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const pageMovies = movies.slice(start, end);
    const currency = getCurrency();
    
    console.log('Displaying', pageMovies.length, 'movies on page', page);

    if (pageMovies.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 4rem; opacity: 0.7;">No movies found.</p>';
        return;
    }

    container.innerHTML = pageMovies.map(movie => {
        const gross = getGrossAmount(movie, currency);
        const formattedGross = formatCurrency(gross, currency);
        const imdbRating = movie.imdb_rating || 0;
        const stars = '⭐'.repeat(Math.floor(imdbRating));
        const isFavorite = isMovieFavorite(movie.id);
        const favoriteIcon = isFavorite ? '❤️' : '🤍';
        
        return `
            <div class="movie-card fade-in" data-observed="false">
                <div class="movie-card-header" onclick="window.location.href='movie.html?id=${movie.id}'">
                    <img src="${getPosterURL(movie)}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x400?text=No+Poster'">
                    <button class="favorite-btn" onclick="event.stopPropagation(); toggleFavorite(${movie.id}, this)" title="${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}">
                        ${favoriteIcon}
                    </button>
                </div>
                <div class="movie-info" onclick="window.location.href='movie.html?id=${movie.id}'">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-year">${movie.year} • ${movie.category}</div>
                    ${imdbRating > 0 ? `<div class="movie-rating"><span class="star">${stars}</span> <span>${imdbRating}</span></div>` : ''}
                    <div class="movie-genre">${getGenresString(movie)}</div>
                    <div class="movie-gross">${formattedGross}</div>
                </div>
            </div>
        `;
    }).join('');

    currentPage = page;
    setupPagination(movies, page);
    
    // Ensure cards are visible immediately
    setTimeout(() => {
        const newCards = container.querySelectorAll('.movie-card');
        newCards.forEach(card => {
            // Force visibility
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.display = 'block';
            card.style.transform = 'translateY(0)';
        });
        
        // Then apply animation observer if needed
        if (typeof window.observeNewElements === 'function') {
            window.observeNewElements();
        }
    }, 50);
}

// Setup filters and search
function setupFilters(movies) {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-select');

    if (!searchInput || !categoryFilter || !sortSelect) return;

    function applyFilters() {
        let filtered = [...movies];

        // Search filter
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(movie => 
                movie.title.toLowerCase().includes(searchTerm) ||
                (movie.director && movie.director.toLowerCase().includes(searchTerm)) ||
                (movie.cast && movie.cast.toLowerCase().includes(searchTerm)) ||
                getGenresString(movie).toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        const category = categoryFilter.value;
        if (category) {
            filtered = filtered.filter(movie => movie.category === category);
        }

        // Sort
        const sortBy = sortSelect.value;
        const currency = getCurrency();
        switch (sortBy) {
            case 'gross':
                filtered.sort((a, b) => {
                    const grossA = getGrossAmount(a, currency);
                    const grossB = getGrossAmount(b, currency);
                    return grossB - grossA;
                });
                break;
            case 'year':
                filtered.sort((a, b) => b.year - a.year);
                break;
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'rating':
                filtered.sort((a, b) => {
                    const ratingA = a.imdb_rating || 0;
                    const ratingB = b.imdb_rating || 0;
                    return ratingB - ratingA;
                });
                break;
        }

        displayMovies(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
    
    // Listen for currency changes
    window.addEventListener('currencyChanged', applyFilters);
}

// Setup pagination
function setupPagination(movies, currentPageNum = 1) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(movies.length / moviesPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="btn btn-secondary" onclick="goToPage(${currentPageNum - 1})" ${currentPageNum === 1 ? 'disabled' : ''}>
            ← Previous
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPageNum - 2 && i <= currentPageNum + 2)) {
            paginationHTML += `
                <button class="btn ${i === currentPageNum ? 'btn-primary active' : 'btn-secondary'}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPageNum - 3 || i === currentPageNum + 3) {
            paginationHTML += `<span style="color: var(--text-secondary); padding: 0.75rem;">...</span>`;
        }
    }

    // Next button
    paginationHTML += `
        <button class="btn btn-secondary" onclick="goToPage(${currentPageNum + 1})" ${currentPageNum === totalPages ? 'disabled' : ''}>
            Next →
        </button>
    `;

    pagination.innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
    const filteredMovies = getFilteredMovies();
    displayMovies(filteredMovies, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get currently filtered movies
function getFilteredMovies() {
    let filtered = [...allMovies];

    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-select');

    if (searchInput) {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(movie => 
                movie.title.toLowerCase().includes(searchTerm) ||
                (movie.director && movie.director.toLowerCase().includes(searchTerm)) ||
                (movie.cast && movie.cast.toLowerCase().includes(searchTerm)) ||
                getGenresString(movie).toLowerCase().includes(searchTerm)
            );
        }
    }

    if (categoryFilter && categoryFilter.value) {
        filtered = filtered.filter(movie => movie.category === categoryFilter.value);
    }

    if (sortSelect) {
        const sortBy = sortSelect.value;
        const currency = getCurrency();
        switch (sortBy) {
            case 'gross':
                filtered.sort((a, b) => {
                    const grossA = getGrossAmount(a, currency);
                    const grossB = getGrossAmount(b, currency);
                    return grossB - grossA;
                });
                break;
            case 'year':
                filtered.sort((a, b) => b.year - a.year);
                break;
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'rating':
                filtered.sort((a, b) => {
                    const ratingA = a.imdb_rating || 0;
                    const ratingB = b.imdb_rating || 0;
                    return ratingB - ratingA;
                });
                break;
        }
    }

    return filtered;
}

// Favorites functionality
function isMovieFavorite(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(movieId);
}

function toggleFavorite(movieId, buttonElement) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(movieId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        if (buttonElement) {
            buttonElement.textContent = '🤍';
            buttonElement.title = 'Add to Favorites';
        }
    } else {
        favorites.push(movieId);
        if (buttonElement) {
            buttonElement.textContent = '❤️';
            buttonElement.title = 'Remove from Favorites';
        }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Show notification
    showNotification(index > -1 ? 'Removed from Favorites' : 'Added to Favorites');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        padding: 1rem 2rem;
        border-radius: 10px;
        border: 1px solid var(--glass-border);
        color: var(--text);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: var(--glass-shadow);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('movies-container')) {
        console.log('Movies page loaded, initializing...');
        loadMovies();
    }
});

// Also try immediately in case DOM is already loaded
if (document.getElementById('movies-container')) {
    console.log('Movies container found, loading immediately...');
    loadMovies();
}
