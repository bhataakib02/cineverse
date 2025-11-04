// Comparison Page JavaScript

let allMovies = [];
let selectedMovies = [null, null, null];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    allMovies = await fetchMovies();
    setupSearchInputs();
});

// Setup search inputs with autocomplete
function setupSearchInputs() {
    for (let i = 1; i <= 3; i++) {
        const input = document.getElementById(`movie${i}-search`);
        const suggestions = document.getElementById(`movie${i}-suggestions`);
        const display = document.getElementById(`movie${i}-display`);
        
        if (!input) continue;
        
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) {
                suggestions.style.display = 'none';
                return;
            }
            
            const filtered = allMovies.filter(movie => 
                movie.title.toLowerCase().includes(query) ||
                (movie.director && movie.director.toLowerCase().includes(query)) ||
                (movie.cast && movie.cast.toLowerCase().includes(query))
            ).slice(0, 5);
            
            if (filtered.length > 0) {
                suggestions.innerHTML = filtered.map(movie => `
                    <div class="suggestion-item" onclick="selectMovie(${i}, ${movie.id})">
                        <strong>${movie.title}</strong> (${movie.year})
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">${movie.category} • ${getGenresString(movie)}</div>
                    </div>
                `).join('');
                suggestions.style.display = 'block';
            } else {
                suggestions.style.display = 'none';
            }
        });
        
        // Hide suggestions when clicking outside
        input.addEventListener('blur', () => {
            setTimeout(() => {
                if (suggestions) suggestions.style.display = 'none';
            }, 200);
        });
    }
}

// Select a movie for comparison
function selectMovie(slot, movieId) {
    const movie = allMovies.find(m => m.id === movieId);
    if (!movie) return;
    
    selectedMovies[slot - 1] = movie;
    
    // Update display
    const input = document.getElementById(`movie${slot}-search`);
    const suggestions = document.getElementById(`movie${slot}-suggestions`);
    const display = document.getElementById(`movie${slot}-display`);
    
    if (input) input.value = movie.title;
    if (suggestions) suggestions.style.display = 'none';
    if (display) {
        display.innerHTML = `
            <div class="movie-info">
                <img src="${getPosterURL(movie)}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/100x150?text=No+Poster'">
                <div>
                    <h4>${movie.title}</h4>
                    <p>${movie.year} • ${movie.category}</p>
                    <button onclick="removeMovie(${slot})" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: rgba(255, 107, 107, 0.3); border: 1px solid #ff6b6b; border-radius: 5px; color: #ff6b6b; cursor: pointer;">Remove</button>
                </div>
            </div>
        `;
        display.classList.add('active');
    }
    
    updateComparison();
}

// Remove a movie from comparison
function removeMovie(slot) {
    selectedMovies[slot - 1] = null;
    const input = document.getElementById(`movie${slot}-search`);
    const display = document.getElementById(`movie${slot}-display`);
    
    if (input) input.value = '';
    if (display) {
        display.innerHTML = '';
        display.classList.remove('active');
    }
    
    updateComparison();
}

// Update comparison table and charts
function updateComparison() {
    const validMovies = selectedMovies.filter(m => m !== null);
    
    if (validMovies.length === 0) {
        document.getElementById('comparison-table').style.display = 'none';
        document.getElementById('comparison-summary').style.display = 'none';
        return;
    }
    
    // Show comparison table
    const table = document.getElementById('comparison-table');
    const grid = table.querySelector('.comparison-grid');
    const summary = document.getElementById('comparison-summary');
    
    table.style.display = 'block';
    summary.style.display = 'block';
    
    // Build comparison grid
    const currency = getCurrency();
    const rows = [
        { label: 'Poster', value: (m) => `<img src="${getPosterURL(m)}" alt="${m.title}" style="width: 80px; height: 120px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/80x120?text=No+Poster'">` },
        { label: 'Title', value: (m) => `<strong style="font-size: 1.1rem;">${m.title}</strong>` },
        { label: 'Year', value: (m) => m.year || 'N/A' },
        { label: 'Category', value: (m) => m.category || 'N/A' },
        { label: 'Director', value: (m) => m.director || 'N/A' },
        { label: 'Cast', value: (m) => (m.cast ? (m.cast.length > 100 ? m.cast.substring(0, 100) + '...' : m.cast) : 'N/A') },
        { label: 'Runtime', value: (m) => m.runtime || 'N/A' },
        { label: 'IMDb Rating', value: (m) => m.imdb_rating ? `<span style="color: #ffd700;">${'⭐'.repeat(Math.floor(m.imdb_rating))}</span> ${m.imdb_rating}/10` : 'N/A' },
        { label: 'Genres', value: (m) => getGenresString(m) },
        { label: 'Worldwide Gross', value: (m) => `<span style="color: #4ade80; font-weight: 600;">${formatCurrency(getGrossAmount(m, currency), currency)}</span>` },
        { label: 'Budget', value: (m) => {
            const budget = currency === 'USD' ? (m.budget_usd || 0) : (m.budget_inr || (m.budget_usd || 0) * 83);
            return budget > 0 ? formatCurrency(budget, currency) : 'N/A';
        }},
        { label: 'Language', value: (m) => m.language || 'N/A' },
        { label: 'Release Date', value: (m) => m.release_date ? formatDate(m.release_date) : (m.year ? m.year : 'N/A') },
        { label: 'Description', value: (m) => m.description ? (m.description.length > 150 ? m.description.substring(0, 150) + '...' : m.description) : 'N/A' }
    ];
    
    // Calculate grid columns: 1 for labels + number of movies
    const numColumns = validMovies.length + 1;
    grid.style.gridTemplateColumns = `200px repeat(${validMovies.length}, 1fr)`;
    
    const totalRows = rows.length + 1; // +1 for header row
    
    grid.innerHTML = `
        <div class="comparison-label" style="font-weight: 700; font-size: 1.1rem; padding: 1.5rem 1rem; background: rgba(102, 126, 234, 0.2); border-bottom: 2px solid var(--glass-border);">Property</div>
        ${validMovies.map((m, idx) => `
            <div class="comparison-label" style="font-weight: 700; font-size: 1rem; padding: 1.5rem 1rem; background: rgba(102, 126, 234, 0.1); text-align: center; border-bottom: 2px solid var(--glass-border); ${idx < validMovies.length - 1 ? 'border-right: 1px solid var(--glass-border);' : ''}">
                <strong>${m.title}</strong><br>
                <span style="font-size: 0.85rem; color: var(--text-secondary);">${m.year} • ${m.category}</span>
            </div>
        `).join('')}
        ${rows.map((row, rowIdx) => `
            <div class="comparison-label" style="padding: 1rem; font-weight: 600; ${rowIdx < rows.length - 1 ? 'border-bottom: 1px solid var(--glass-border);' : ''}">${row.label}</div>
            ${validMovies.map((m, idx) => `
                <div class="comparison-value" style="padding: 1rem; text-align: center; ${rowIdx < rows.length - 1 ? 'border-bottom: 1px solid var(--glass-border);' : ''} ${idx < validMovies.length - 1 ? 'border-right: 1px solid var(--glass-border);' : ''}">${row.value(m)}</div>
            `).join('')}
        `).join('')}
    `;
    
    // Update summary cards
    updateSummary(validMovies, currency);
}

// Update summary cards with visual data
function updateSummary(movies, currency) {
    const summary = document.getElementById('comparison-summary');
    const cardsContainer = summary.querySelector('.summary-cards');
    
    if (!cardsContainer) return;
    
    const currencySymbol = currency === 'USD' ? '$' : '₹';
    
    // Box Office Summary
    const boxOfficeData = movies.map(m => ({
        title: m.title,
        amount: getGrossAmount(m, currency),
        formatted: formatCurrency(getGrossAmount(m, currency), currency)
    }));
    const highestBoxOffice = boxOfficeData.reduce((max, m) => m.amount > max.amount ? m : max, boxOfficeData[0]);
    
    // Ratings Summary
    const ratingsData = movies.map(m => ({
        title: m.title,
        rating: m.imdb_rating || 0,
        stars: Math.floor(m.imdb_rating || 0)
    }));
    const highestRating = ratingsData.reduce((max, m) => m.rating > max.rating ? m : max, ratingsData[0]);
    
    // Year Summary
    const yearsData = movies.map(m => ({
        title: m.title,
        year: m.year || 'N/A'
    }));
    
    cardsContainer.innerHTML = `
        <div class="summary-card">
            <h3>💰 Box Office Performance</h3>
            <div class="summary-content">
                ${boxOfficeData.map(m => `
                    <div class="summary-item">
                        <span class="movie-name">${m.title.length > 25 ? m.title.substring(0, 25) + '...' : m.title}</span>
                        <span class="movie-value ${m.amount === highestBoxOffice.amount ? 'highlight' : ''}">${m.formatted}</span>
                    </div>
                `).join('')}
                <div class="summary-winner">
                    🏆 Winner: <strong>${highestBoxOffice.title}</strong> with ${highestBoxOffice.formatted}
                </div>
            </div>
        </div>
        
        <div class="summary-card">
            <h3>⭐ IMDb Ratings</h3>
            <div class="summary-content">
                ${ratingsData.map(m => `
                    <div class="summary-item">
                        <span class="movie-name">${m.title.length > 25 ? m.title.substring(0, 25) + '...' : m.title}</span>
                        <span class="movie-value ${m.rating === highestRating.rating ? 'highlight' : ''}">
                            ${'⭐'.repeat(m.stars)} ${m.rating > 0 ? m.rating + '/10' : 'N/A'}
                        </span>
                    </div>
                `).join('')}
                <div class="summary-winner">
                    🏆 Highest Rated: <strong>${highestRating.title}</strong> with ${highestRating.rating}/10
                </div>
            </div>
        </div>
        
        <div class="summary-card">
            <h3>📅 Release Years</h3>
            <div class="summary-content">
                ${yearsData.map(m => `
                    <div class="summary-item">
                        <span class="movie-name">${m.title.length > 25 ? m.title.substring(0, 25) + '...' : m.title}</span>
                        <span class="movie-value">${m.year}</span>
                    </div>
                `).join('')}
                <div class="summary-info">
                    ${movies.length > 1 ? `Year Range: ${Math.min(...yearsData.map(d => d.year === 'N/A' ? 0 : d.year))} - ${Math.max(...yearsData.map(d => d.year === 'N/A' ? 0 : d.year))}` : ''}
                </div>
            </div>
        </div>
    `;
}

// Removed chart function - using summary cards instead

// Listen for currency changes
window.addEventListener('currencyChanged', () => {
    const validMovies = selectedMovies.filter(m => m !== null);
    if (validMovies.length > 0) {
        updateComparison();
    }
});

