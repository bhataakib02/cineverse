// Analytics Dashboard JavaScript

let allMovies = [];
let chartInstances = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Analytics page loaded');
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded!');
        showError('Chart.js library not loaded. Please refresh the page.');
        return;
    }
    
    await loadAnalyticsData();
    setupScrollToTop();
});

// Also try immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded
    console.log('DOM already loaded for analytics, initializing...');
    if (typeof Chart !== 'undefined') {
        loadAnalyticsData();
    }
}

// Load all analytics data
async function loadAnalyticsData() {
    try {
        // Show loading state
        const statsGrid = document.getElementById('stats-grid');
        if (statsGrid) {
            statsGrid.innerHTML = `
                <div class="stat-card" style="grid-column: 1 / -1; text-align: center;">
                    <p style="color: var(--text-secondary);">Loading analytics data...</p>
                </div>
            `;
        }

        // Fetch all movies
        console.log('Fetching movies for analytics...');
        allMovies = await fetchMovies();
        console.log('Movies loaded for analytics:', allMovies.length);

        if (!allMovies || allMovies.length === 0) {
            showError('No movies data available. Please ensure the server is running and movies are loaded.');
            return;
        }

        // Load stats
        loadStats();
        
        // Wait for DOM to be ready before creating charts
        requestAnimationFrame(() => {
            setTimeout(() => {
                // Load all charts
                loadTop10BarChart();
                loadIndustryPieChart();
                loadYearLineChart();
                loadGenreDonutChart();
                loadDirectorsBarChart();
                loadGrowthLineChart();
            }, 300);
        });
        
    } catch (error) {
        console.error('Error loading analytics:', error);
        showError('Failed to load analytics data: ' + error.message + '. Please try again later.');
    }
}

// Load summary statistics
function loadStats() {
    const totalMovies = allMovies.length;
    const currency = getCurrency();
    
    const totalRevenue = allMovies.reduce((sum, m) => sum + getGrossAmount(m, currency), 0);
    const avgRating = totalMovies > 0 ? allMovies.reduce((sum, m) => sum + (m.imdb_rating || 0), 0) / totalMovies : 0;
    const totalBudget = allMovies.reduce((sum, m) => sum + (m.budget_inr || (m.budget_usd || 0) * 83), 0);

    const totalMoviesEl = document.getElementById('total-movies');
    const totalRevenueEl = document.getElementById('total-revenue');
    const avgRatingEl = document.getElementById('avg-rating');
    const totalBudgetEl = document.getElementById('total-budget');

    if (totalMoviesEl) totalMoviesEl.textContent = totalMovies;
    if (totalRevenueEl) totalRevenueEl.textContent = formatCurrency(totalRevenue, currency);
    if (avgRatingEl) avgRatingEl.textContent = avgRating.toFixed(1) + '/10';
    if (totalBudgetEl) totalBudgetEl.textContent = formatCurrency(totalBudget, currency);
}

// Top 10 Movies Bar Chart
function loadTop10BarChart() {
    const chartEl = document.getElementById('top10BarChart');
    if (!chartEl) {
        console.error('Top 10 chart element not found');
        return;
    }

    if (!allMovies || allMovies.length === 0) {
        console.warn('No movies data for chart');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No movies data available</p>';
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Chart.js library not loaded</p>';
        return;
    }

    const top10 = allMovies
        .filter(m => m && m.title)
        .sort((a, b) => getGrossAmount(b, 'INR') - getGrossAmount(a, 'INR'))
        .slice(0, 10);

    if (top10.length === 0) {
        console.warn('No valid movies for top 10 chart');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No valid movies data available</p>';
        return;
    }

    const labels = top10.map(m => (m.title && m.title.length > 15 ? m.title.substring(0, 15) + '...' : m.title) || 'Unknown');
    const data = top10.map(m => getGrossAmount(m, 'INR') / 10000000); // Convert to crores
    
    if (data.every(d => d === 0 || isNaN(d))) {
        console.warn('No valid revenue data for chart');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No revenue data available</p>';
        return;
    }

    // Ensure container is visible
    const container = chartEl.parentElement;
    if (container) {
        container.style.display = 'block';
    }

    destroyChart('top10BarChart');
    
    try {
        chartInstances.top10BarChart = new Chart(chartEl.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gross (₹ Crores)',
                data: data,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
            }]
        },
        options: {
            ...getChartOptions(),
            maintainAspectRatio: false
        }
        });
        console.log('Top 10 bar chart created successfully');
    } catch (error) {
        console.error('Error creating top 10 chart:', error);
    }
}

// Industry Comparison Pie Chart
function loadIndustryPieChart() {
    const chartEl = document.getElementById('industryPieChart');
    if (!chartEl) {
        console.error('Industry pie chart element not found');
        return;
    }

    if (!allMovies || allMovies.length === 0) {
        console.warn('No movies data for industry chart');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No movies data available</p>';
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Chart.js library not loaded</p>';
        return;
    }

    const industries = ['Hollywood', 'Bollywood', 'Tollywood'];
    const data = industries.map(industry => {
        return allMovies
            .filter(m => m && m.category === industry)
            .reduce((sum, m) => sum + getGrossAmount(m, 'INR'), 0) / 10000000;
    });

    if (data.every(d => d === 0)) {
        console.warn('No valid industry data for chart');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No industry data available</p>';
        return;
    }

    const container = chartEl.parentElement;
    if (container) {
        container.style.display = 'block';
    }

    destroyChart('industryPieChart');
    
    try {
        chartInstances.industryPieChart = new Chart(chartEl.getContext('2d'), {
        type: 'pie',
        data: {
            labels: industries,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(255, 107, 107, 0.8)',
                    'rgba(74, 222, 128, 0.8)'
                ],
                borderColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(255, 107, 107, 1)',
                    'rgba(74, 222, 128, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            ...getChartOptions(),
            plugins: {
                ...getChartOptions().plugins,
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return context.label + ': ₹' + context.parsed.toFixed(2) + ' Cr';
                        }
                    }
                }
            },
            maintainAspectRatio: false
        }
        });
        console.log('Industry pie chart created successfully');
    } catch (error) {
        console.error('Error creating industry pie chart:', error);
    }
}

// Gross Earnings per Year Line Chart
function loadYearLineChart() {
    const chartEl = document.getElementById('yearLineChart');
    if (!chartEl) {
        console.error('Year line chart element not found');
        return;
    }

    if (!allMovies || allMovies.length === 0) {
        console.warn('No movies data for year chart');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No movies data available</p>';
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Chart.js library not loaded</p>';
        return;
    }

    const yearData = {};
    allMovies.forEach(movie => {
        if (!movie || !movie.year) return;
        const year = movie.year;
        if (!yearData[year]) yearData[year] = 0;
        yearData[year] += getGrossAmount(movie, 'INR') / 10000000;
    });

    const years = Object.keys(yearData).sort();
    if (years.length === 0) {
        console.warn('No year data available');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No year data available</p>';
        return;
    }

    const revenues = years.map(year => yearData[year]);

    const container = chartEl.parentElement;
    if (container) {
        container.style.display = 'block';
    }

    destroyChart('yearLineChart');
    
    try {
        chartInstances.yearLineChart = new Chart(chartEl.getContext('2d'), {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Gross Earnings (₹ Crores)',
                data: revenues,
                borderColor: 'rgba(0, 243, 255, 1)',
                backgroundColor: 'rgba(0, 243, 255, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...getChartOptions(),
            maintainAspectRatio: false
        }
        });
        console.log('Top 10 bar chart created successfully');
    } catch (error) {
        console.error('Error creating top 10 chart:', error);
    }
}

// Genre Distribution Donut Chart
function loadGenreDonutChart() {
    const chartEl = document.getElementById('genreDonutChart');
    if (!chartEl) {
        console.error('Genre donut chart element not found');
        return;
    }

    if (!allMovies || allMovies.length === 0) {
        console.warn('No movies data for genre chart');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No movies data available</p>';
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Chart.js library not loaded</p>';
        return;
    }

    const genreData = {};
    allMovies.forEach(movie => {
        if (!movie) return;
        const genres = Array.isArray(movie.genres) ? movie.genres : (movie.genres ? [movie.genres] : ['Unknown']);
        genres.forEach(genre => {
            if (!genre) return;
            if (!genreData[genre]) genreData[genre] = 0;
            genreData[genre]++;
        });
    });

    const sortedGenres = Object.entries(genreData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8); // Top 8 genres

    if (sortedGenres.length === 0) {
        console.warn('No genre data available');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No genre data available</p>';
        return;
    }

    const labels = sortedGenres.map(([genre]) => genre);
    const data = sortedGenres.map(([, count]) => count);

    const colors = generateColors(data.length);

    const container = chartEl.parentElement;
    if (container) {
        container.style.display = 'block';
    }

    destroyChart('genreDonutChart');
    
    try {
        chartInstances.genreDonutChart = new Chart(chartEl.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2
            }]
        },
        options: {
            ...getChartOptions(),
            plugins: {
                ...getChartOptions().plugins,
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return context.label + ': ' + context.parsed + ' movies';
                        }
                    }
                }
            },
            maintainAspectRatio: false
        }
        });
        console.log('Genre donut chart created successfully');
    } catch (error) {
        console.error('Error creating genre donut chart:', error);
    }
}

// Top 5 Directors Horizontal Bar
function loadDirectorsBarChart() {
    const chartEl = document.getElementById('directorsBarChart');
    if (!chartEl) {
        console.error('Directors bar chart element not found');
        return;
    }

    if (!allMovies || allMovies.length === 0) {
        console.warn('No movies data for directors chart');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No movies data available</p>';
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Chart.js library not loaded</p>';
        return;
    }

    const directorData = {};
    allMovies.forEach(movie => {
        if (!movie) return;
        const director = movie.director || 'Unknown';
        if (!directorData[director]) directorData[director] = 0;
        directorData[director] += getGrossAmount(movie, 'INR') / 10000000;
    });

    const topDirectors = Object.entries(directorData)
        .filter(([director]) => director !== 'Unknown')
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (topDirectors.length === 0) {
        console.warn('No director data available');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No director data available</p>';
        return;
    }

    const labels = topDirectors.map(([director]) => director);
    const data = topDirectors.map(([, revenue]) => revenue);

    const container = chartEl.parentElement;
    if (container) {
        container.style.display = 'block';
    }

    destroyChart('directorsBarChart');
    
    try {
        chartInstances.directorsBarChart = new Chart(chartEl.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Lifetime Earnings (₹ Crores)',
                data: data,
                backgroundColor: 'rgba(255, 215, 0, 0.8)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 2
            }]
        },
        options: {
            ...getChartOptions(),
            indexAxis: 'y',
            maintainAspectRatio: false
        }
        });
        console.log('Directors bar chart created successfully');
    } catch (error) {
        console.error('Error creating directors bar chart:', error);
    }
}

// Year-on-Year Growth Line Chart
function loadGrowthLineChart() {
    const chartEl = document.getElementById('growthLineChart');
    if (!chartEl) {
        console.error('Growth line chart element not found');
        return;
    }

    if (!allMovies || allMovies.length === 0) {
        console.warn('No movies data for growth chart');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No movies data available</p>';
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Chart.js library not loaded</p>';
        return;
    }

    const yearData = {};
    allMovies.forEach(movie => {
        if (!movie || !movie.year) return;
        const year = movie.year;
        if (!yearData[year]) yearData[year] = 0;
        yearData[year] += getGrossAmount(movie, 'INR') / 10000000;
    });

    const years = Object.keys(yearData).sort();
    if (years.length < 2) {
        console.warn('Not enough year data for growth chart');
        chartEl.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Not enough year data for growth chart (need at least 2 years)</p>';
        return;
    }

    const revenues = years.map(year => yearData[year]);
    const growth = revenues.map((rev, i) => {
        if (i === 0) return 0;
        const prev = revenues[i - 1];
        return prev > 0 ? ((rev - prev) / prev * 100) : 0;
    });

    const container = chartEl.parentElement;
    if (container) {
        container.style.display = 'block';
    }

    destroyChart('growthLineChart');
    
    try {
        chartInstances.growthLineChart = new Chart(chartEl.getContext('2d'), {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'YoY Growth (%)',
                data: growth,
                borderColor: 'rgba(255, 107, 107, 1)',
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...getChartOptions(),
            maintainAspectRatio: false
        }
        });
        console.log('Growth line chart created successfully');
    } catch (error) {
        console.error('Error creating growth line chart:', error);
    }
}

// Helper: Get common chart options
function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'var(--text)'
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    color: 'var(--text)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: 'var(--text)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        }
    };
}

// Helper: Destroy chart instance
function destroyChart(chartId) {
    if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
        delete chartInstances[chartId];
    }
}

// Helper: Generate colors for charts
function generateColors(count) {
    const colors = [
        'rgba(102, 126, 234, 0.8)',
        'rgba(255, 107, 107, 0.8)',
        'rgba(74, 222, 128, 0.8)',
        'rgba(255, 215, 0, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(0, 243, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(153, 102, 255, 0.8)'
    ];
    return colors.slice(0, count);
}

// Helper: Show error message
function showError(message) {
    const container = document.querySelector('.charts-container');
    if (container) {
        container.innerHTML = `
            <div class="chart-card" style="grid-column: 1 / -1; text-align: center;">
                <p style="color: var(--text-secondary);">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 1rem;">Retry</button>
            </div>
        `;
    }
}

// Scroll to top button
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Listen for currency changes
window.addEventListener('currencyChanged', () => {
    loadStats();
    // Note: Charts use INR by default, but can be updated if needed
});

