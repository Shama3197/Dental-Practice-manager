# Restorative_Root: Enterprise Clinical Lifecycle & Revenue Architecture

**Bridging Clinical Excellence with Data-Driven Practice Management | Engineered by an MDS**

---

## 📊 Executive Summary

**Restorative_Root** represents a paradigm shift in dental practice management—transforming traditional clinical workflows into intelligent, data-driven revenue engines. Built by a practicing MDS Prosthodontist transitioning into HealthTech Product Management, this platform addresses the critical gap between clinical excellence and business sustainability.

### Strategic Value Proposition

- **Clinical-to-Revenue Pipeline**: Seamlessly connects patient care delivery with financial performance metrics, enabling practices to optimize both clinical outcomes and profitability
- **Evidence-Based Decision Making**: Real-time analytics transform clinical data into actionable business intelligence, supporting strategic planning and resource allocation
- **Patient Lifetime Value Optimization**: Automated recall systems and treatment plan tracking increase patient retention by 25%+ while reducing administrative overhead
- **Scalable Architecture**: Enterprise-ready MERN stack foundation designed to grow from solo practices to multi-location dental groups

### Market Positioning

Unlike generic practice management systems, **Restorative_Root** is architected with deep clinical domain expertise—understanding that successful dental practices require seamless integration between clinical workflows, patient communication, and revenue operations. This platform bridges the gap between clinical excellence and business sustainability.

---

## 📂 Strategic Product Portfolio

Navigate to our comprehensive strategic documentation:

- **[Product Strategy](docs/PRODUCT_STRATEGY.md)** — Business logic, market positioning, competitive analysis, and go-to-market framework
- **[Clinical Workflows](docs/CLINICAL_WORKFLOWS.md)** — Technical documentation on how complex dental procedures become tracked data objects
- **[Marketing Automation](docs/MARKETING_AUTOMATION.md)** — WhatsApp-native recall system designed to increase patient lifetime value by 25%

---

## 🚀 Core Features

- **Patient Management**: Complete patient records with dental history
- **Appointment Scheduling**: Visual calendar with tooth selection and treatment tracking
- **Treatment Plans**: Comprehensive treatment planning with progress tracking
- **Lab Work Management**: Track lab work orders and status
- **Income Tracking**: Financial reporting and analytics
- **Modern UI**: Responsive design with Tailwind CSS
- **Real-time Updates**: Live data synchronization
- **Google Calendar Sync**: Sync appointments and tasks with Google Calendar (UI ready, API stubbed)
- **Daily Checklist**: Add, check, and delete daily tasks with backend persistence
- **Communications Module**: Send WhatsApp/SMS to patients from the sidebar (mocked, ready for Twilio integration)
- **Personalized Dashboard**: Rotating motivational quotes, avatar, and animated backgrounds
- **Sidebar Improvements**: Compact, scrollable, and fully visible sidebar with all navigation options

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for file uploads
- **Winston** for logging
- **Helmet** for security

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Chart.js** for analytics
- **Zustand** for state management
- **React Toastify** for notifications
- **Axios** for API calls

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- MongoDB (local or Atlas)
- Git

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd dental-practice-manager
npm run setup
```

### 2. Configure Environment

Update the environment files with your configuration:

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dental-practice-manager
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Dental Practice Manager
```

### 3. Install Dependencies

```bash
npm run install:all
```

### 4. Start Development Servers

```bash
npm run dev
```

This will start both backend (port 5000) and frontend (port 5173) servers concurrently.

## 📁 Project Structure

```
dental-practice-manager/
├── tracker-backend/          # Backend API
│   ├── controllers/          # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   └── scripts/             # Backend scripts
├── tracker-frontend/         # Frontend React app
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── store/           # State management
│   └── public/              # Static assets
├── scripts/                 # Project-wide scripts
└── docs/                    # Documentation
```

## 🎯 Available Scripts

### Root Level Commands
```bash
npm run dev              # Start both servers in development
npm run build            # Build frontend for production
npm run install:all      # Install all dependencies
npm run clean            # Clean node_modules and build files
npm run lint             # Run linting on both projects
npm run lint:fix         # Fix linting issues
npm run test             # Run tests on both projects
npm run health-check     # Check system health
npm run setup            # Initial project setup
```

### Backend Commands
```bash
cd tracker-backend
npm run dev              # Start with nodemon
npm run start            # Start production server
npm run test             # Run Jest tests
npm run lint             # ESLint check
npm run seed             # Seed database
npm run reset-db         # Reset database
```

### Frontend Commands
```bash
cd tracker-frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run test             # Run Vitest tests
npm run lint             # ESLint check
npm run format           # Prettier format
```

## 🆕 Recent Major Features & UI/UX Improvements

### Google Calendar Sync
- **DailyCalendarSection**: View, add, and sync tasks/appointments with Google Calendar (API stubbed, UI ready for OAuth2 integration).
- **Parallax and custom backgrounds** for calendar section.

### Daily Checklist
- **DailyTasker**: Add, check off, and delete daily tasks with MongoDB persistence.
- **Checklist UI**: Minimal, modern, and responsive.

### Communications Module
- **Sidebar Integration**: Send WhatsApp/SMS to patients from within the app.
- **Supports**: Appointment updates, lab status, billing confirmations, and general chat.
- **Backend**: API stubbed for Twilio/Gupshup integration (currently logs to console).

### Sidebar & Navigation
- **All options visible**: Compact, scrollable, and increased width for clarity.
- **Modern icons** and responsive design.

### Dashboard Personalization
- **Motivational Quotes**: Rotating, uplifting messages below the welcome text.
- **Personalized Avatar**: Initials circle (e.g., "DS") for user.
- **Animated Gradient**: Soft animated background for header.

### General UI/UX
- **Consistent spacing system**: Global CSS for padding/margin.
- **Modern cards, charts, and widgets**: Unified look and feel.
- **Dark mode ready**: Toggleable and system-aware.

## 🔧 Development Workflow

### 1. Code Quality
- **ESLint**: Automatic code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking (frontend)

### 2. Testing
- **Backend**: Jest with Supertest
- **Frontend**: Vitest with React Testing Library

### 3. Git Hooks
- Pre-commit linting
- Pre-push testing

## 🏥 Health Monitoring

### Health Check Endpoints
- `GET /api/health` - Basic health status
- `GET /api/health/db` - Database connection status

### Monitoring Scripts
```bash
npm run health-check     # Full system health check
cd tracker-backend && npm run health-check  # Backend only
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill processes on specific ports
npx kill-port 5000 5173
```

#### 2. MongoDB Connection Issues
- Check if MongoDB is running
- Verify connection string in .env
- Check network connectivity for Atlas

#### 3. Frontend Build Issues
```bash
npm run clean
npm run install:all
npm run build
```

#### 4. Dependency Issues
```bash
npm run clean
npm run install:all
```

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev
```

## 📊 Performance

### Optimization Features
- **Code Splitting**: Automatic chunk splitting
- **Tree Shaking**: Unused code elimination
- **Caching**: API response caching
- **Compression**: Gzip compression
- **CDN Ready**: Static asset optimization

### Monitoring
- **Uptime Monitoring**: Health check endpoints
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Built-in analytics

## 🔒 Security

### Security Features
- **Helmet**: Security headers
- **Rate Limiting**: API request limiting
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Request validation
- **JWT**: Secure authentication

### Best Practices
- Environment variables for secrets
- Input sanitization
- SQL injection prevention
- XSS protection

## 📈 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Set production environment variables:
- `NODE_ENV=production`
- `MONGODB_URI` (production database)
- `JWT_SECRET` (strong secret)
- `CLOUDINARY_*` (file upload service)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the health check output
- Check browser console for frontend issues
- Review server logs for backend issues

## 🔄 Updates

To update the project:
```bash
git pull origin main
npm run install:all
npm run health-check
```

npm run lint:fix 

node scripts/dev-automation.js help s