// Admin panel JavaScript

let isLoggedIn = false;

// Check if admin is logged in
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        showDashboard();
        loadAdminData();
    } else {
        showLogin();
    }
}

// Show login form
function showLogin() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('dashboard-section').style.display = 'none';
    isLoggedIn = false;
}

// Show dashboard
function showDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    isLoggedIn = true;
}

// Login form handler
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('login-message');

            try {
                const result = await adminLogin(username, password);
                messageDiv.textContent = '✓ Login successful!';
                messageDiv.style.color = '#4ade80';
                setTimeout(() => {
                    showDashboard();
                    loadAdminData();
                }, 1000);
            } catch (error) {
                messageDiv.textContent = '✗ ' + error.message;
                messageDiv.style.color = '#f5576c';
            }
        });
    }
    
    // Modal close handlers
    const modal = document.getElementById('edit-movie-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeEditModal();
        }
    });

    // Edit movie form handler
    const editMovieForm = document.getElementById('edit-movie-form');
    if (editMovieForm) {
        editMovieForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageDiv = document.getElementById('edit-movie-message');
            const movieId = parseInt(document.getElementById('edit-movie-id').value);

            // Convert form data to new format
            const domesticGross = parseInt(document.getElementById('edit-movie-domestic').value);
            const internationalGross = parseInt(document.getElementById('edit-movie-international').value);
            const worldwideGross = parseInt(document.getElementById('edit-movie-worldwideGross').value);
            
            // Calculate USD values (assuming INR is entered, convert to USD)
            const USD_TO_INR = 83;
            const domesticGrossUSD = Math.round(domesticGross / USD_TO_INR);
            const internationalGrossUSD = Math.round(internationalGross / USD_TO_INR);
            const worldwideGrossUSD = Math.round(worldwideGross / USD_TO_INR);
            
            // Parse genres (comma-separated string to array)
            const genresString = document.getElementById('edit-movie-genre').value;
            const genres = genresString.split(',').map(g => g.trim());
            
            const movieData = {
                title: document.getElementById('edit-movie-title').value,
                year: parseInt(document.getElementById('edit-movie-year').value),
                category: document.getElementById('edit-movie-category').value,
                genres: genres,
                director: document.getElementById('edit-movie-director').value,
                cast: document.getElementById('edit-movie-cast').value,
                language: document.getElementById('edit-movie-language').value,
                runtime: document.getElementById('edit-movie-runtime').value,
                release_date: document.getElementById('edit-movie-releaseDate').value,
                domestic_gross_usd: domesticGrossUSD,
                domestic_gross_inr: domesticGross,
                international_gross_usd: internationalGrossUSD,
                international_gross_inr: internationalGross,
                worldwide_gross_usd: worldwideGrossUSD,
                worldwide_gross_inr: worldwideGross,
                imdb_rating: parseFloat(document.getElementById('edit-movie-imdb').value) || 0,
                poster_url: document.getElementById('edit-movie-posterURL').value,
                trailer_url: document.getElementById('edit-movie-trailerURL').value || '',
                description: document.getElementById('edit-movie-description').value || ''
            };

            try {
                await updateMovie(movieId, movieData);
                messageDiv.textContent = '✓ Movie updated successfully!';
                messageDiv.style.color = '#4ade80';
                setTimeout(() => {
                    closeEditModal();
                    loadAdminData();
                }, 1500);
            } catch (error) {
                messageDiv.textContent = '✗ Error: ' + error.message;
                messageDiv.style.color = '#f5576c';
            }
        });
    }

    // Add movie form handler
    const addMovieForm = document.getElementById('add-movie-form');
    if (addMovieForm) {
        addMovieForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageDiv = document.getElementById('add-movie-message');

            // Convert form data to new format
            const domesticGross = parseInt(document.getElementById('movie-domestic').value);
            const internationalGross = parseInt(document.getElementById('movie-international').value);
            const worldwideGross = parseInt(document.getElementById('movie-worldwideGross').value);
            
            // Calculate USD values (assuming INR is entered, convert to USD)
            const USD_TO_INR = 83;
            const domesticGrossUSD = Math.round(domesticGross / USD_TO_INR);
            const internationalGrossUSD = Math.round(internationalGross / USD_TO_INR);
            const worldwideGrossUSD = Math.round(worldwideGross / USD_TO_INR);
            
            // Parse genres (comma-separated string to array)
            const genresString = document.getElementById('movie-genre').value;
            const genres = genresString.split(',').map(g => g.trim());
            
            const movieData = {
                title: document.getElementById('movie-title').value,
                year: parseInt(document.getElementById('movie-year').value),
                category: document.getElementById('movie-category').value,
                genres: genres,
                director: document.getElementById('movie-director').value,
                cast: document.getElementById('movie-cast').value,
                language: document.getElementById('movie-language').value,
                runtime: document.getElementById('movie-runtime').value,
                release_date: document.getElementById('movie-releaseDate').value,
                domestic_gross_usd: domesticGrossUSD,
                domestic_gross_inr: domesticGross,
                international_gross_usd: internationalGrossUSD,
                international_gross_inr: internationalGross,
                worldwide_gross_usd: worldwideGrossUSD,
                worldwide_gross_inr: worldwideGross,
                imdb_rating: parseFloat(document.getElementById('movie-imdb').value) || 0,
                poster_url: document.getElementById('movie-posterURL').value,
                trailer_url: document.getElementById('movie-trailerURL').value || '',
                description: document.getElementById('movie-description').value || '',
                source_urls: []
            };

            try {
                await addMovie(movieData);
                messageDiv.textContent = '✓ Movie added successfully!';
                messageDiv.style.color = '#4ade80';
                addMovieForm.reset();
                loadAdminData();
            } catch (error) {
                messageDiv.textContent = '✗ Error: ' + error.message;
                messageDiv.style.color = '#f5576c';
            }
        });
    }
});

// Load admin data (movies and contacts)
async function loadAdminData() {
    await loadAdminMovies();
    await loadContactMessages();
}

// Load movies for admin
async function loadAdminMovies() {
    try {
        const movies = await fetchMovies();
        const container = document.getElementById('admin-movies-list');
        if (!container) return;

        const currency = getCurrency();
        container.innerHTML = movies.map(movie => {
            const gross = getGrossAmount(movie, currency);
            const formattedGross = formatCurrency(gross, currency);
            return `
            <div class="admin-movie-item">
                <div>
                    <h3 style="margin-bottom: 0.5rem; color: var(--text);">${movie.title} (${movie.year})</h3>
                    <p style="opacity: 0.7; font-size: 0.9rem; color: var(--text-secondary);">${movie.category} • ${getGenresString(movie)}</p>
                    <p style="margin-top: 0.5rem; color: #4ade80; font-weight: 600;">
                        ${formattedGross}
                    </p>
                </div>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-small" onclick="editMovie(${movie.id})">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteMovieConfirm(${movie.id}, '${movie.title}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
        }).join('');
    } catch (error) {
        console.error('Error loading admin movies:', error);
    }
}

// Delete movie with confirmation
async function deleteMovieConfirm(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
        return;
    }

    try {
        await deleteMovie(id);
        alert('Movie deleted successfully!');
        loadAdminData();
    } catch (error) {
        alert('Error deleting movie: ' + error.message);
    }
}

// Edit movie - Open modal with pre-filled data
async function editMovie(id) {
    try {
        // Fetch movie data
        const movie = await fetchMovieById(id);
        if (!movie) {
            alert('Movie not found!');
            return;
        }

        // Populate edit form
        document.getElementById('edit-movie-id').value = movie.id;
        document.getElementById('edit-movie-title').value = movie.title || '';
        document.getElementById('edit-movie-year').value = movie.year || '';
        document.getElementById('edit-movie-category').value = movie.category || 'Hollywood';
        document.getElementById('edit-movie-genre').value = Array.isArray(movie.genres) ? movie.genres.join(', ') : (movie.genres || '');
        document.getElementById('edit-movie-director').value = movie.director || '';
        document.getElementById('edit-movie-cast').value = movie.cast || '';
        document.getElementById('edit-movie-language').value = movie.language || '';
        document.getElementById('edit-movie-runtime').value = movie.runtime || '';
        document.getElementById('edit-movie-releaseDate').value = movie.release_date || '';
        document.getElementById('edit-movie-imdb').value = movie.imdb_rating || '';
        document.getElementById('edit-movie-posterURL').value = movie.poster_url || '';
        document.getElementById('edit-movie-trailerURL').value = movie.trailer_url || '';
        document.getElementById('edit-movie-description').value = movie.description || '';

        // Handle gross amounts - convert USD to INR if needed
        const domesticGross = movie.domestic_gross_inr || (movie.domestic_gross_usd ? movie.domestic_gross_usd * 83 : 0);
        const internationalGross = movie.international_gross_inr || (movie.international_gross_usd ? movie.international_gross_usd * 83 : 0);
        const worldwideGross = movie.worldwide_gross_inr || (movie.worldwide_gross_usd ? movie.worldwide_gross_usd * 83 : 0);

        document.getElementById('edit-movie-domestic').value = domesticGross;
        document.getElementById('edit-movie-international').value = internationalGross;
        document.getElementById('edit-movie-worldwideGross').value = worldwideGross;

        // Show modal
        document.getElementById('edit-movie-modal').style.display = 'flex';
    } catch (error) {
        console.error('Error loading movie for edit:', error);
        alert('Error loading movie: ' + error.message);
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('edit-movie-modal').style.display = 'none';
    document.getElementById('edit-movie-form').reset();
    document.getElementById('edit-movie-message').textContent = '';
}

// Load contact messages
async function loadContactMessages() {
    try {
        const contacts = await fetchContacts();
        const container = document.getElementById('contact-messages');
        if (!container) return;

        if (contacts.length === 0) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.7; padding: 2rem;">No contact messages yet.</p>';
            return;
        }

        container.innerHTML = contacts.map(contact => `
            <div style="background: var(--glass-bg); backdrop-filter: blur(20px); padding: 1.5rem; border-radius: 15px; border: 1px solid var(--glass-border);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <div>
                        <strong style="font-size: 1.1rem;">${contact.name}</strong>
                        <p style="opacity: 0.7; font-size: 0.9rem; margin-top: 0.25rem;">${contact.email}</p>
                    </div>
                    <div style="opacity: 0.6; font-size: 0.85rem;">
                        ${new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <p style="line-height: 1.6; opacity: 0.9;">${contact.message}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

// Logout
function logout() {
    localStorage.removeItem('adminToken');
    showLogin();
    document.getElementById('login-form').reset();
}

