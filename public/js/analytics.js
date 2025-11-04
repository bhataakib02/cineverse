// Analytics Dashboard JavaScript

let allMovies = [];
let chartInstances = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Analytics page loaded');
    await loadAnalyticsData();
    setupScrollToTop();
});

// Load all analytics data
async function loadAnalyticsData() {
    try {
        // Show loading state
        document.getElementById('stats-grid').innerHTML = `
            <div class="stat-card" style="grid-column: 1 / -1; text-align: center;">
                <p style="color: var(--text-secondary);">Loading analytics data...</p>
            </div>
        `;

        // Fetch all movies
        allMovies = await fetchMovies();
        console.log('Movies loaded for analytics:', allMovies.length);

        if (!allMovies || allMovies.length === 0) {
            showError('No movies data available');
            return;
        }

        // Load stats
        loadStats();
        
        // Load all charts
        loadTop10BarChart();
        loadIndustryPieChart();
        loadYearLineChart();
        loadGenreDonutChart();
        loadDirectorsBarChart();
        loadGrowthLineChart();
        
    } catch (error) {
        console.error('Error loading analytics:', error);
        showError('Failed to load analytics data. Please try again later.');
    }
}

// Load summary statistics
function loadStats() {
    const totalMovies = allMovies.length;
    const currency = getCurrency();
    
    const totalRevenue = allMovies.reduce((sum, m) => sum + getGrossAmount(m, currency), 0);
    const avgRating = allMovies.reduce((sum, m) => sum + (m.imdb_rating || 0), 0) / totalMovies;
    const totalBudget = allMovies.reduce((sum, m) => sum + (m.budget_inr || (m.budget_usd || 0) * 83), 0);

    document.getElementById('total-movies').textContent = totalMovies;
    document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue, currency);
    document.getElementById('avg-rating').textContent = avgRating.toFixed(1) + '/10';
    document.getElementById('total-budget').textContent = formatCurrency(totalBudget, currency);
}

// Top 10 Movies Bar Chart
function loadTop10BarChart() {
    const chartEl = document.getElementById('top10BarChart');
    if (!chartEl) return;

    const top10 = allMovies
        .sort((a, b) => getGrossAmount(b, 'INR') - getGrossAmount(a, 'INR'))
        .slice(0, 10);

    const labels = top10.map(m => m.title.length > 15 ? m.title.substring(0, 15) + '...' : m.title);
    const data = top10.map(m => getGrossAmount(m, 'INR') / 10000000); // Convert to crores

    destroyChart('top10BarChart');
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
        options: getChartOptions()
    });
}

// Industry Comparison Pie Chart
function loadIndustryPieChart() {
    const chartEl = document.getElementById('industryPieChart');
    if (!chartEl) return;

    const industries = ['Hollywood', 'Bollywood', 'Tollywood'];
    const data = industries.map(industry => {
        return allMovies
            .filter(m => m.category === industry)
            .reduce((sum, m) => sum + getGrossAmount(m, 'INR'), 0) / 10000000;
    });

    destroyChart('industryPieChart');
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
            }
        }
    });
}

// Gross Earnings per Year Line Chart
function loadYearLineChart() {
    const chartEl = document.getElementById('yearLineChart');
    if (!chartEl) return;

    const yearData = {};
    allMovies.forEach(movie => {
        const year = movie.year;
        if (!yearData[year]) yearData[year] = 0;
        yearData[year] += getGrossAmount(movie, 'INR') / 10000000;
    });

    const years = Object.keys(yearData).sort();
    const revenues = years.map(year => yearData[year]);

    destroyChart('yearLineChart');
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
        options: getChartOptions()
    });
}

// Genre Distribution Donut Chart
function loadGenreDonutChart() {
    const chartEl = document.getElementById('genreDonutChart');
    if (!chartEl) return;

    const genreData = {};
    allMovies.forEach(movie => {
        const genres = Array.isArray(movie.genres) ? movie.genres : [movie.genres || 'Unknown'];
        genres.forEach(genre => {
            if (!genreData[genre]) genreData[genre] = 0;
            genreData[genre]++;
        });
    });

    const sortedGenres = Object.entries(genreData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8); // Top 8 genres

    const labels = sortedGenres.map(([genre]) => genre);
    const data = sortedGenres.map(([, count]) => count);

    const colors = generateColors(data.length);

    destroyChart('genreDonutChart');
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
            }
        }
    });
}

// Top 5 Directors Horizontal Bar
function loadDirectorsBarChart() {
    const chartEl = document.getElementById('directorsBarChart');
    if (!chartEl) return;

    const directorData = {};
    allMovies.forEach(movie => {
        const director = movie.director || 'Unknown';
        if (!directorData[director]) directorData[director] = 0;
        directorData[director] += getGrossAmount(movie, 'INR') / 10000000;
    });

    const topDirectors = Object.entries(directorData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const labels = topDirectors.map(([director]) => director);
    const data = topDirectors.map(([, revenue]) => revenue);

    destroyChart('directorsBarChart');
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
            indexAxis: 'y'
        }
    });
}

// Year-on-Year Growth Line Chart
function loadGrowthLineChart() {
    const chartEl = document.getElementById('growthLineChart');
    if (!chartEl) return;

    const yearData = {};
    allMovies.forEach(movie => {
        const year = movie.year;
        if (!yearData[year]) yearData[year] = 0;
        yearData[year] += getGrossAmount(movie, 'INR') / 10000000;
    });

    const years = Object.keys(yearData).sort();
    const revenues = years.map(year => yearData[year]);
    const growth = revenues.map((rev, i) => {
        if (i === 0) return 0;
        const prev = revenues[i - 1];
        return prev > 0 ? ((rev - prev) / prev * 100) : 0;
    });

    destroyChart('growthLineChart');
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
        options: getChartOptions()
    });
}

// Helper: Get common chart options
function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: true,
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

