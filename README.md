# 🎬 CineVerse - Box Office Mojo Clone

A premium movie analytics platform inspired by Box Office Mojo, featuring box office data in **Indian Rupees (₹)** for Hollywood, Bollywood, and Tollywood films.

![CineVerse](https://img.shields.io/badge/CineVerse-2030%20Edition-purple) ![License](https://img.shields.io/badge/License-ISC-blue)

## ✨ Features

- 🎥 **Comprehensive Movie Database** - Hollywood, Bollywood, and Tollywood films
- 💰 **Indian Rupees Display** - All box office figures in ₹
- 🔍 **Advanced Search & Filters** - Search by title, director, cast, genre
- 📊 **Interactive Charts** - Visual earnings comparison with Chart.js
- 🎨 **Premium UI Design** - Futuristic 2030 aesthetic with neon-glass morphism
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🔐 **Admin Panel** - CRUD operations for managing movies
- ❤️ **Favorites System** - Save your favorite movies locally
- 🎞️ **Movie Details** - Comprehensive information pages with trailers
- 📈 **Top 10 Leaderboard** - Animated ranking of highest-grossing films

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone or download this repository**
   ```bash
   cd CineVerse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### For Development (with auto-reload)

```bash
npm run dev
```

## 📁 Project Structure

```
CineVerse/
│
├── backend/
│   ├── server.js              # Express server
│   ├── routes/
│   │   ├── movies.js          # Movie API routes
│   │   ├── contact.js         # Contact form routes
│   │   └── auth.js            # Admin authentication
│   └── data/
│       ├── movies.json        # Movie database (JSON)
│       ├── contacts.json      # Contact messages
│       └── admins.json        # Admin credentials
│
├── frontend/
│   ├── index.html             # Homepage
│   ├── movies.html            # All movies page
│   ├── movie.html             # Movie details page
│   ├── hollywood.html         # Hollywood category
│   ├── bollywood.html         # Bollywood category
│   ├── tollywood.html         # Tollywood category
│   ├── top10.html             # Top 10 leaderboard
│   ├── about.html             # About page
│   ├── contact.html           # Contact form
│   ├── admin.html             # Admin panel
│   ├── css/
│   │   └── style.css          # Premium styling
│   └── js/
│       ├── api.js             # API helper functions
│       ├── main.js            # Main JavaScript
│       ├── movies.js          # Movies page logic
│       ├── admin.js           # Admin panel logic
│       └── contact.js         # Contact form logic
│
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔑 Admin Access

**Default Admin Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

*Note: Change these credentials in production!*

## 🎨 Design Features

### Color Themes by Category
- **Hollywood:** Blue & Purple gradient
- **Bollywood:** Orange & Gold gradient
- **Tollywood:** Red & Cyan gradient

### UI Elements
- Animated gradient backgrounds
- Glass morphism cards with neon borders
- 3D hover effects on movie cards
- Smooth scroll animations
- Custom gradient scrollbar
- Preloader with film reel animation
- Sticky navbar with blur effect

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | Get all movies |
| GET | `/api/movies/:id` | Get movie by ID |
| POST | `/api/movies` | Add new movie |
| PUT | `/api/movies/:id` | Update movie |
| DELETE | `/api/movies/:id` | Delete movie |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact` | Get all contact messages (admin) |
| POST | `/api/auth/login` | Admin login |

## 💻 Technologies Used

- **Frontend:**
  - HTML5
  - CSS3 (Custom animations, Glassmorphism)
  - Vanilla JavaScript (ES6+)
  - Chart.js (for analytics)

- **Backend:**
  - Node.js
  - Express.js
  - JSON file storage (offline-ready)

## 🌐 Deployment

### Backend Deployment (Render, Heroku, etc.)

1. Set `PORT` environment variable
2. Deploy the backend folder
3. Ensure all routes are accessible

### Frontend Deployment (Vercel, Netlify, etc.)

1. Update `API_BASE_URL` in `frontend/js/api.js` to point to your backend
2. Deploy the frontend folder
3. Configure CORS if needed

### Full Stack Deployment

For a complete setup, deploy both frontend and backend, ensuring the frontend can communicate with the backend API.

## 📝 Data Format

Movies are stored in JSON format with the following structure:

```json
{
  "id": 1,
  "title": "Movie Title",
  "year": 2022,
  "category": "Hollywood",
  "genre": "Action, Drama",
  "director": "Director Name",
  "cast": "Actor 1, Actor 2",
  "language": "English",
  "runtime": "180 min",
  "releaseDate": "2022-12-25",
  "domestic": 100000000,
  "international": 200000000,
  "worldwideGross": 300000000,
  "posterURL": "https://...",
  "trailerURL": "https://www.youtube.com/embed/...",
  "description": "Movie description",
  "currency": "₹"
}
```

## 🛠️ Customization

### Adding Movies

1. Login to admin panel
2. Fill in the "Add New Movie" form
3. Submit to add the movie to the database

### Modifying Colors

Edit `frontend/css/style.css` and update the CSS variables in `:root`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --hollywood-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --bollywood-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --tollywood-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}
```

## 🐛 Troubleshooting

### Server won't start
- Check if port 3000 is available
- Ensure all dependencies are installed (`npm install`)
- Verify Node.js version (v14+)

### Movies not loading
- Check browser console for errors
- Verify backend server is running
- Check CORS settings if frontend and backend are on different domains

### Admin login fails
- Verify default credentials (admin/admin123)
- Check backend routes are working
- Clear browser localStorage if needed

## 📄 License

ISC License - Feel free to use this project for educational or commercial purposes.

## 🙏 Credits

- **Design Inspiration:** Box Office Mojo
- **Icons & Emojis:** Unicode Emoji
- **Fonts:** Google Fonts (Poppins, Orbitron)
- **Charts:** Chart.js

## 📧 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ for cinema enthusiasts worldwide** 🎬✨

*CineVerse - Explore Cinema Beyond Borders*

