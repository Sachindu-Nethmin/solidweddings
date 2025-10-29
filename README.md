# Solid Weddings - Professional Wedding Photography Website

A modern, responsive wedding photography portfolio and business website built with React and Vite. This website showcases professional wedding photography services in Sri Lanka with an elegant user interface, smooth animations, and integrated contact functionality.

## 🌟 Features

- **Responsive Design**: Fully responsive layout that works seamlessly on all devices
- **Modern UI/UX**: Clean, elegant interface with smooth animations using Framer Motion
- **Dynamic Hero Sections**: Rotating background images with parallax effects
- **Multi-page Navigation**: Home, About, Services, Gallery, and Contact pages
- **Interactive Gallery**: Beautiful photo gallery showcasing wedding photography work
- **Contact Form**: Integrated EmailJS contact form for client inquiries
- **Performance Optimized**: Built with Vite for fast loading and optimal performance
- **SEO Ready**: Proper meta tags and semantic HTML structure

## 🛠️ Technologies Used

- **React 19** - UI library for building user interface
- **Vite 7** - Next-generation frontend build tool
- **React Router DOM 7** - Client-side routing
- **Framer Motion** - Animation library for smooth transitions
- **EmailJS** - Email service integration for contact form
- **ESLint** - Code linting and quality assurance
- **Jest & Mocha** - Testing frameworks

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- npm (comes with Node.js) or yarn package manager

## 🚀 How to Run the Application

### 1. Clone the Repository

```bash
git clone <repository-url>
cd solid
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up EmailJS (for Contact Form)

To enable the contact form functionality, follow these steps:

1. Create a free account at [EmailJS](https://www.emailjs.com/)
2. Set up your email service (Gmail recommended)
3. Create an email template
4. Get your Public Key, Service ID, and Template ID
5. Refer to `EmailJS-Setup-Guide.md` for detailed setup instructions

### 4. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another port if 5173 is busy)

### 5. Build for Production

To create a production-ready build:

```bash
npm run build
```

The optimized files will be generated in the `dist` folder.

### 6. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Creates an optimized production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run test` | Runs Jest tests |
| `npm run test:functional` | Runs Mocha functional tests |
| `npm run test:all` | Runs all tests (Jest + Mocha) |

## 📁 Project Structure

```
solid/
├── public/                # Static assets
│   ├── images/           # Image assets (logos, wedding photos, icons)
│   │   ├── weddings/     # Wedding photography gallery
│   │   ├── logos/        # Brand logos
│   │   └── icons/        # UI icons
│   └── vite.svg
├── src/
│   ├── components/       # Reusable React components
│   │   ├── Header.jsx    # Navigation header
│   │   └── Footer.jsx    # Footer component
│   ├── pages/            # Page components
│   │   ├── Home.jsx      # Homepage
│   │   ├── About.jsx     # About page
│   │   ├── Services.jsx  # Services page
│   │   ├── Gallery.jsx   # Photo gallery
│   │   └── Contact.jsx   # Contact form page
│   ├── __tests__/        # Test files
│   ├── App.jsx           # Main app component
│   ├── App.css           # App styles
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── EmailJS-Setup-Guide.md # EmailJS setup instructions
```

## 🎨 Pages Overview

- **Home**: Landing page with hero section, featured services, and testimonials
- **About**: Information about the photographer and the business
- **Services**: Detailed breakdown of photography packages and services
- **Gallery**: Showcase of wedding photography portfolio
- **Contact**: Contact form and business information

## 🔧 Configuration

### Vite Configuration
The project uses Vite for building and development. Configuration can be modified in `vite.config.js`.

### ESLint Configuration
Code quality rules are defined in `eslint.config.js`.

## 📱 Browser Support

This application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Developer

Developed for Solid Weddings - Professional Wedding Photography Services in Sri Lanka

## 📧 Support

For questions or support regarding this application, please refer to the contact information on the website or consult the EmailJS setup guide for email integration issues.

---

**Note**: Make sure to configure EmailJS properly for the contact form to work. See `EmailJS-Setup-Guide.md` for detailed instructions.
