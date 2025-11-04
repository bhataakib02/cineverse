# 🎬 CineVerse Analytics 2030

<div align="center">

![CineVerse](https://img.shields.io/badge/CineVerse-2030%20Edition-purple?style=for-the-badge) ![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge) ![Node](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge) ![Express](https://img.shields.io/badge/Express.js-Latest-red?style=for-the-badge)

**Your Ultimate Box Office Analytics Platform**

*Explore Cinema Beyond Borders — From Mumbai to Hollywood, Track Every Hit!*

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

---

**Developed with ❤️ by Mohammad Aakib Bhat**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Features in Detail](#-features-in-detail)
- [Design Philosophy](#-design-philosophy)
- [Deployment Guide](#-deployment-guide)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

**CineVerse Analytics 2030** is a premium, full-stack movie analytics platform that brings comprehensive box office data to your fingertips. Inspired by Box Office Mojo, this platform provides real-time analytics, detailed movie information, and beautiful visualizations for Hollywood, Bollywood, and Tollywood films.

### 🌟 What Makes It Special?

- **100+ Real Movies** with complete metadata
- **Smart Currency Conversion** - Display in ₹ (Crores/Lakhs) or $ (Millions/Billions)
- **Modern 2030 Aesthetic** - Elegant calligraphy logo, glassmorphism design
- **Interactive Analytics** - Multiple Chart.js visualizations
- **Fully Responsive** - Perfect on all devices
- **Admin Panel** - Complete CRUD operations
- **SEO Optimized** - Meta tags and Open Graph support

---

## ✨ Key Features

### 🎥 Core Functionality

| Feature | Description |
|---------|-------------|
| **📊 Analytics Dashboard** | Interactive charts showing revenue trends, category distribution, and year-wise analysis |
| **🔍 Advanced Search** | Real-time search by title, director, cast, genre, or category |
| **⚖️ Movie Comparison** | Side-by-side comparison of multiple movies with detailed metrics |
| **📱 Responsive Design** | Mobile-first approach with hamburger menu and adaptive layouts |
| **🌙 Dark/Light Mode** | Theme toggle with persistent user preferences |
| **❤️ Favorites System** | Save favorite movies with localStorage persistence |
| **💰 Smart Currency** | Automatic formatting (₹ Crores/Lakhs or $ Millions/Billions) |

### 🎨 Premium UI/UX

- **Elegant Calligraphy Logo** - Custom SVG logo with animated gradient
- **Glassmorphism Design** - Modern frosted glass effects with subtle blur
- **Animated Gradients** - Dynamic background animations
- **Scroll Animations** - Smooth fade-in effects using Intersection Observer
- **Floating Particles** - Animated background particles for visual appeal
- **Hero Section** - Rotating movie posters with iconic Bollywood quotes
- **Featured Movies** - Top grossing movies showcase with rank badges
- **Category Showcase** - Beautiful category cards with hover effects

### 🔐 Admin Features

- **Full CRUD Operations** - Create, Read, Update, Delete movies
- **CSV Import** - Bulk import movies from CSV files
- **Contact Management** - View and manage user contact messages
- **Secure Authentication** - Admin login system
- **Modal Dialogs** - Modern edit interface with pre-filled forms

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Advanced styling (Glassmorphism, Animations, Gradients)
- **Vanilla JavaScript (ES6+)** - No framework dependencies
- **Chart.js** - Interactive data visualizations
- **Google Fonts** - Poppins, Orbitron, Great Vibes

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **JSON File Storage** - Lightweight, offline-ready database
- **Multer** - File upload handling (CSV import)
- **Nodemailer** - Email functionality (contact form)

### Development Tools
- **Git** - Version control
- **npm** - Package management

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning)

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhataakib02/cineverse.git
   cd cineverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

---

## 📁 Project Structure

```
CineVerse/
│
├── backend/
│   ├── server.js                 # Express server configuration
│   ├── routes/
│   │   ├── movies.js            # Movie CRUD & category routes
│   │   ├── contact.js           # Contact form handling
│   │   ├── stats.js             # Analytics & statistics endpoints
│   │   ├── import.js            # CSV import functionality
│   │   └── auth.js              # Admin authentication
│   ├── utils/
│   │   └── csvParser.js         # CSV parsing utility
│   └── data/
│       ├── movies.json          # Movie database (100+ movies)
│       ├── contacts.json        # Contact messages storage
│       └── admins.json          # Admin credentials
│
├── public/
│   ├── index.html               # Homepage with hero section
│   ├── movies.html              # All movies page with filters
│   ├── movie.html               # Movie details page with tabs
│   ├── hollywood.html           # Hollywood category page
│   ├── bollywood.html           # Bollywood category page
│   ├── tollywood.html           # Tollywood category page
│   ├── analytics.html           # Analytics dashboard
│   ├── compare.html             # Movie comparison tool
│   ├── about.html               # About page
│   ├── contact.html             # Contact form
│   ├── admin.html               # Admin panel
│   ├── css/
│   │   ├── style.css            # Main stylesheet
│   │   └── homepage-enhancements.css  # Homepage specific styles
│   └── js/
│       ├── api.js               # API helper functions & currency
│       ├── main.js              # Theme, scroll, animations
│       ├── movies.js            # Movies page logic
│       ├── analytics.js         # Analytics dashboard charts
│       ├── compare.js           # Movie comparison logic
│       ├── admin.js             # Admin panel logic
│       └── seo-helper.js        # SEO meta tags management
│
├── package.json                 # Dependencies & scripts
├── README.md                    # This file
└── PROJECT_COMPLETE.md          # Project completion checklist
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Movies

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/movies` | Get all movies | - |
| `GET` | `/movies/:id` | Get movie by ID | `id` (number) |
| `GET` | `/movies/category/:category` | Get movies by category | `category` (string) |
| `GET` | `/movies/top10` | Get top 10 grossing movies | - |
| `POST` | `/movies` | Add new movie | Body: Movie object |
| `PUT` | `/movies/:id` | Update movie | `id` (number), Body: Movie object |
| `DELETE` | `/movies/:id` | Delete movie | `id` (number) |

#### Contact

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `POST` | `/contact` | Submit contact form | Body: { name, email, message } |
| `GET` | `/contact` | Get all messages (admin) | - |

#### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stats` | Get platform statistics |
| `GET` | `/stats/revenue` | Get total revenue data |
| `GET` | `/stats/categories` | Get category distribution |

#### Import

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/import` | Import movies from CSV | FormData: file |

#### Authentication

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `POST` | `/auth/login` | Admin login | Body: { username, password } |

### Example Request

```javascript
// Fetch all movies
fetch('http://localhost:3000/api/movies')
  .then(response => response.json())
  .then(data => console.log(data));

// Get movie by ID
fetch('http://localhost:3000/api/movies/1')
  .then(response => response.json())
  .then(movie => console.log(movie));
```

---

## 🎨 Features in Detail

### 1. Smart Currency Display

The platform automatically formats large numbers for better readability:

- **INR (₹):**
  - ≥ ₹1 Crore: `₹284.75 Cr`
  - ≥ ₹1 Lakh: `₹15.5 L`
  - < ₹1 Lakh: `₹45,000`

- **USD ($):**
  - ≥ $1 Billion: `$1.50B`
  - ≥ $1 Million: `$150.25M`
  - < $1 Million: `$45,000`

### 2. Analytics Dashboard

Interactive charts showing:
- **Top 10 Movies** - Bar chart of highest grossing films
- **Category Distribution** - Pie chart of movies by category
- **Year-wise Trends** - Line chart showing revenue over time
- **Director Analysis** - Top directors by revenue
- **Growth Rate** - Year-over-year growth visualization

### 3. Movie Details Page

Comprehensive movie information with tabbed interface:
- **Overview** - Description, meta information, source links
- **Cast & Crew** - Director and cast details
- **Box Office** - Detailed revenue breakdown
- **Reviews** - User reviews and ratings system
- **Awards** - Awards and accolades
- **Trailer** - Embedded YouTube trailer
- **Similar Movies** - Recommendations based on category

### 4. Search & Filter System

- **Real-time Search** - Instant results as you type
- **Multi-criteria Filtering** - By category, genre, year, rating
- **Sorting Options** - By revenue, year, title, rating
- **Pagination** - Efficient handling of large datasets

### 5. Comparison Tool

Compare multiple movies side-by-side:
- Revenue comparison
- Budget analysis
- Rating comparison
- Runtime and metadata
- Visual summary cards

---

## 🎭 Design Philosophy

### Color Palette

- **Primary Gradient:** Purple → Pink → Blue
- **Hollywood:** Blue & Purple tones
- **Bollywood:** Pink & Orange tones
- **Tollywood:** Pink & Yellow tones
- **Accent Colors:** Subtle, elegant tones (not neon)

### Typography

- **Logo:** Great Vibes (Calligraphy) - Elegant, sophisticated
- **Headers:** Orbitron - Futuristic, bold
- **Body:** Poppins - Clean, readable

### UI Principles

- **Glassmorphism** - Subtle transparency with blur effects
- **Minimal Neon** - Classy, professional color scheme
- **Smooth Animations** - Subtle, not overwhelming
- **Consistent Spacing** - Professional layout
- **Mobile-First** - Responsive design priority

---

## 🌐 Deployment Guide

### Backend Deployment (Render, Heroku, Railway)

1. **Set environment variables:**
   ```bash
   PORT=3000
   NODE_ENV=production
   ```

2. **Update API base URL** in `public/js/api.js`:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.com/api';
   ```

3. **Deploy backend:**
   - Push to GitHub
   - Connect to hosting service
   - Deploy from `backend/` directory

### Frontend Deployment (Vercel, Netlify, GitHub Pages)

1. **Build static files** (if needed)
2. **Update API endpoints** to production URL
3. **Deploy `public/` folder**

### Full Stack Deployment

For a complete setup:
1. Deploy backend to a hosting service
2. Update frontend API URLs
3. Deploy frontend
4. Configure CORS if needed

---

## 🔑 Admin Access

**Default Admin Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **Important:** Change these credentials in production!

**Admin Panel Features:**
- View all movies
- Add new movies
- Edit existing movies
- Delete movies
- View contact messages
- Import movies from CSV

---

## 📊 Data Format

Movies are stored in JSON format with the following structure:

```json
{
  "id": 1,
  "title": "Movie Title",
  "year": 2022,
  "category": "Hollywood",
  "genre": ["Action", "Drama"],
  "director": "Director Name",
  "cast": "Actor 1, Actor 2",
  "language": "English",
  "runtime": "180 min",
  "release_date": "2022-12-25",
  "worldwide_gross_usd": 300000000,
  "worldwide_gross_inr": 24900000000,
  "domestic_gross_usd": 100000000,
  "domestic_gross_inr": 8300000000,
  "budget_usd": 150000000,
  "budget_inr": 12450000000,
  "imdb_rating": 8.5,
  "poster_url": "https://image.tmdb.org/t/p/w500/...",
  "trailer_url": "https://www.youtube.com/embed/...",
  "description": "Movie description...",
  "awards": ["Oscar Winner", "Best Picture"],
  "source_urls": [
    "https://www.boxofficemojo.com/...",
    "https://www.imdb.com/...",
    "https://en.wikipedia.org/..."
  ]
}
```

---

## 🛠️ Customization

### Adding New Movies

1. **Via Admin Panel:**
   - Login to admin panel
   - Fill in the "Add New Movie" form
   - Submit

2. **Via CSV Import:**
   - Prepare CSV file with required columns
   - Upload via admin panel import feature

3. **Direct JSON Edit:**
   - Edit `backend/data/movies.json`
   - Follow the data format structure

### Modifying Colors

Edit `public/css/style.css`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --neon-blue: #5b9bd5;
  --neon-pink: #d4a5c7;
  --neon-purple: #9b8fb8;
  --neon-cyan: #7db9b6;
}
```

### Changing Logo

Replace the SVG in:
- `public/index.html` (hero section)
- All HTML files (navbar)

---

## 🐛 Troubleshooting

### Common Issues

**Server won't start:**
- Check if port 3000 is available
- Ensure all dependencies are installed (`npm install`)
- Verify Node.js version (v14+)

**Movies not loading:**
- Check browser console for errors
- Verify backend server is running
- Check CORS settings if frontend and backend are on different domains
- Verify `movies.json` file exists and is valid JSON

**Admin login fails:**
- Verify default credentials (admin/admin123)
- Check backend routes are working
- Clear browser localStorage if needed
- Verify `admins.json` file exists

**Charts not displaying:**
- Ensure Chart.js is loaded
- Check browser console for errors
- Verify data is being fetched correctly
- Check canvas elements are properly sized

**CSS not applying:**
- Clear browser cache
- Verify CSS files are linked correctly
- Check for CSS syntax errors
- Ensure all CSS files are in correct paths

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 📄 License

This project is licensed under the **ISC License**.

You are free to:
- Use the project for commercial purposes
- Modify and distribute
- Use privately
- Patent use

---

## 📧 Contact & Support

**Developer:** Mohammad Aakib Bhat

**Project:** CineVerse Analytics 2030

**Repository:** [https://github.com/bhataakib02/cineverse](https://github.com/bhataakib02/cineverse)

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact via the contact form on the website

---

## 🙏 Acknowledgments

- **Design Inspiration:** Box Office Mojo
- **Icons & Emojis:** Unicode Emoji
- **Fonts:** Google Fonts (Poppins, Orbitron, Great Vibes)
- **Charts:** Chart.js
- **Backend Framework:** Express.js
- **Community:** All contributors and users

---

## 📈 Project Statistics

- **Total Movies:** 100+
- **Categories:** 3 (Hollywood, Bollywood, Tollywood)
- **Pages:** 10+ fully functional pages
- **API Endpoints:** 15+
- **Lines of Code:** 5000+
- **Technologies:** 10+

---

<div align="center">

**Built with ❤️ for cinema enthusiasts worldwide** 🎬✨

*CineVerse - Explore Cinema Beyond Borders*

**Your Ultimate Box Office Analytics Platform | © 2025 CineVerse Analytics | Developed by Mohammad Aakib Bhat**

[⬆ Back to Top](#-cineverse-analytics-2030)

</div>
