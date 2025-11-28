# 🎨 Sameer Ali Khan - Premium Portfolio Website

[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-production--ready-success)](https://github.com/SameerAliKhan-git/portfolio)

A stunning, Netflix-inspired portfolio website built with modern web technologies, featuring 3D animations, custom cursor effects, and a professional Express.js backend.

![Portfolio Preview](https://via.placeholder.com/1200x600/141414/E50914?text=Portfolio+Preview)

## ✨ Features

- 🎬 **Custom Animated SAK Logo Loader** - Professional branding animation
- 🎯 **3D Tilt Effects** - Interactive card interactions
- 🎨 **Netflix-Inspired Dark Theme** - Premium aesthetics
- ⚡ **Lightning Fast** - Optimized performance with caching
- 🔒 **Security First** - Helmet, CORS, rate limiting, CSP
- 📱 **Fully Responsive** - Mobile-first design
- ♿ **Accessible** - WCAG compliant with ARIA labels
- 🌐 **PWA Ready** - Service Worker, offline support
- 📊 **SEO Optimized** - Meta tags, structured data, sitemap
- 🎭 **Custom Cursor** - Enhanced desktop experience
- 📈 **Analytics Ready** - Visitor tracking built-in
- 🌓 **Theme Toggle** - Dark/Light mode support
- 📧 **Email Automation** - Instant confirmations via SMTP
- 💾 **Database Tracking** - SQLite storage for all submissions
- 📊 **Prisma Studio** - Built-in data management dashboard

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/SameerAliKhan-git/portfolio.git

# Navigate to project directory
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The server will start at `http://localhost:3000`

### Production Deployment

```bash
# Set environment to production
set NODE_ENV=production  # Windows
export NODE_ENV=production  # Linux/Mac

# Start production server
npm start
```

## 📁 Project Structure

```
Portfolio/
├── public/                    # Static assets
│   ├── index.html            # Main HTML file
│   ├── styles.css            # Stylesheets
│   ├── script.js             # Client-side JavaScript
│   ├── sw.js                 # Service Worker
│   ├── manifest.json         # PWA manifest
│   ├── robots.txt            # SEO robots
│   └── sitemap.xml           # SEO sitemap
├── server.js                 # Express backend
├── package.json              # Dependencies
└── Sameer_Ali_Khan_Resume.pdf
```

## 🛠️ Technology Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Security:** Helmet, CORS, Rate Limiting
- **Performance:** Compression middleware
- **Logging:** Morgan

### Frontend

- **Core:** HTML5, CSS3, Vanilla JavaScript
- **Fonts:** Inter, Bebas Neue
- **Icons:** Font Awesome 6.4.0
- **Features:** PWA, Service Worker

## 📡 API Endpoints

| Endpoint               | Method   | Description             |
| ---------------------- | -------- | ----------------------- |
| `/`                    | GET      | Main portfolio page     |
| `/api/download-resume` | GET      | Download resume PDF     |
| `/api/contact`         | POST     | Submit contact form     |
| `/api/health`          | GET      | Health check            |
| `/api/newsletter`      | POST     | Newsletter subscription |
| `/api/guestbook`       | GET/POST | Guestbook entries       |
| `/api/visit`           | POST     | Track visitor           |
| `/api/stats`           | GET      | Visitor statistics      |

## 🔒 Security Features

- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Rate limiting (3 levels)
- ✅ Input validation & sanitization
- ✅ XSS prevention
- ✅ Honeypot spam detection
- ✅ Content Security Policy
- ✅ Body size limits

## ⚡ Performance

- ✅ Gzip/Brotli compression
- ✅ Static asset caching (1 year)
- ✅ Resource preconnect
- ✅ DNS prefetch
- ✅ Service Worker caching
- ✅ Optimized animations
- ✅ Lazy loading ready

## 📊 NPM Scripts

```bash
npm start          # Production server
npm run dev        # Development server
npm run analyze    # Lighthouse performance audit
npm test           # Run tests (not implemented)
npm run lint       # Lint code (not configured)
```

## 🎨 Sections

1. **Hero** - Animated introduction with typing effect
2. **About** - Professional bio with highlights
3. **Services** - Offered services showcase
4. **Experience** - Professional timeline
5. **Projects** - Filterable project gallery
6. **Skills** - Interactive skill radar chart
7. **Certifications** - Professional certifications
8. **Achievements** - Notable achievements
9. **Blog** - Blog posts (optional)
10. **Education** - Academic background
11. **Contact** - Contact form with validation

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1440px

## 🚀 Deployment

### Recommended Platforms

- **Vercel** (Recommended)
- **Netlify**
- **Railway**
- **Render**
- **Heroku**
- **DigitalOcean**
- **AWS EC2**

### Environment Variables

```env
PORT=3000                    # Server port
NODE_ENV=production          # Environment mode
SMTP_USER=your-email@gmail.com # Gmail Address
SMTP_PASS=your-app-password    # Gmail App Password
```

## 🗄️ Database & Prisma

This project uses **SQLite** to store contact submissions and analytics.

### View Data

You can visualize and manage your data using **Prisma Studio**:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555`.

### Schema

The database schema is defined in `prisma/schema.prisma`.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Sameer Ali Khan**

- Email: sammysameeralikhan@gmail.com
- Phone: +91-7382898751
- LinkedIn: [linkedin.com/in/sameeralikhan1](https://in.linkedin.com/in/sameeralikhan1)
- GitHub: [github.com/SameerAliKhan-git](https://github.com/SameerAliKhan-git)
- Location: Hyderabad, India

## 🙏 Acknowledgments

- Netflix for design inspiration
- Font Awesome for icons
- Google Fonts for typography
- Express.js community

## 📈 Project Status

✅ **Production Ready** - Actively maintained

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub.

## 💡 Feature Requests

Have an idea? Open an issue with the `enhancement` label.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Made with ❤️ by Sameer Ali Khan**

**Last Updated:** November 2025
