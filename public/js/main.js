// Main JavaScript for CineVerse

// Hide preloader when page loads
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// Scroll progress bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    }
});

// Theme toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeToggle) {
        themeToggle.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
    }
    
    // Toggle theme on click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        });
    }
}

// Currency toggle
function initCurrencyToggle() {
    const currencyToggle = document.querySelectorAll('.currency-btn');
    const currentCurrency = getCurrency();
    
    // Set active state
    currencyToggle.forEach(btn => {
        if (btn.dataset.currency === currentCurrency) {
            btn.classList.add('active');
        }
    });
    
    // Toggle currency on click
    currencyToggle.forEach(btn => {
        btn.addEventListener('click', () => {
            const currency = btn.dataset.currency;
            setCurrency(currency);
            
            // Update active state
            currencyToggle.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Reload current page data if needed
            if (window.location.reload) {
                // Trigger currency change event
                window.dispatchEvent(new CustomEvent('currencyChanged'));
            }
        });
    });
}

// Listen for currency changes
window.addEventListener('currencyChanged', () => {
    // Reload movies display if on movies page
    if (typeof loadMovies === 'function') {
        loadMovies();
    }
    if (typeof loadTop10 === 'function') {
        loadTop10();
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
        }
        lastScroll = currentScroll;
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Make observer globally accessible
window.animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Unobserve after animation to prevent re-triggering
            window.animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Function to observe new elements (make globally accessible)
window.observeNewElements = function() {
    const cards = document.querySelectorAll('.movie-card:not([data-observed]), .leaderboard-item:not([data-observed])');
    cards.forEach(card => {
        // Check if card is already visible (opacity is 1 or not set)
        const currentOpacity = card.style.opacity || window.getComputedStyle(card).opacity;
        
        // If card is already visible, don't animate it
        if (currentOpacity === '1' || parseFloat(currentOpacity) > 0.9) {
            card.setAttribute('data-observed', 'true');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            return; // Skip animation for already visible cards
        }
        
        card.setAttribute('data-observed', 'true');
        
        // Check if card is already in viewport
        const rect = card.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) {
            // Card is already visible, show it immediately
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            // Card is not in viewport, set initial state and observe
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            window.animationObserver.observe(card);
        }
    });
};

// Scroll to top button functionality
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

// Observe movie cards and other elements
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCurrencyToggle();
    window.observeNewElements();
    setupScrollToTop();
    
    // Also observe when DOM changes (for dynamic content)
    const mutationObserver = new MutationObserver(() => {
        window.observeNewElements();
    });
    
    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get genres as string (handle both array and string)
function getGenresString(movie) {
    if (Array.isArray(movie.genres)) {
        return movie.genres.join(', ');
    }
    return movie.genres || movie.genre || 'N/A';
}

// Get release date (handle both formats)
function getReleaseDate(movie) {
    return movie.release_date || movie.releaseDate || 'N/A';
}

// Get poster URL (handle both formats)
function getPosterURL(movie) {
    return movie.poster_url || movie.posterURL || 'https://via.placeholder.com/300x400?text=No+Poster';
}

// Get trailer URL (handle both formats)
function getTrailerURL(movie) {
    return movie.trailer_url || movie.trailerURL || '';
}
