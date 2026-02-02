# 🌙 NightLog - Advanced AI Dream Journal

> Transform your dreams into insights with AI-powered analysis and beautiful visualizations.

NightLog is a full-stack dream journaling application that combines the power of artificial intelligence with an elegant, modern interface. Record your dreams, discover patterns, and unlock the hidden meanings behind your subconscious mind.

---

## 📊 Development Progress

### ✅ Completed Features

| Feature | Status | Branch |
|---------|--------|--------|
| Project Setup (Client + Server) | ✅ Done | `main` |
| Landing Page | ✅ Done | `main` |
| Auth Backend (JWT + Cookies) | ✅ Done | `main` |
| Auth Pages (Login/Register) | ✅ Done | `feature/auth-pages` |
| Dashboard (List, Search, Filters) | ✅ Done | `feature/auth-pages` |
| Dream Editor (Create/Edit) | ✅ Done | `feature/auth-pages` |

### 🔄 Pending Features

| Feature | Status |
|---------|--------|
| Dream Routes (Backend) | ⏳ Pending |
| AI Analysis Integration | ⏳ Pending |
| Insights Dashboard (Charts) | ⏳ Pending |
| Trash/Restore System | ⏳ Pending |
| Profile Settings | ⏳ Pending |

### 📁 Files Created This Session

**Auth Pages:**
- `client/src/pages/Auth/Login.tsx`
- `client/src/pages/Auth/Register.tsx`
- `client/src/pages/Auth/Auth.module.scss`
- `client/src/validation/authValidation.ts`
- `client/src/redux/api/authApi.ts`
- `client/src/redux/slices/authSlice.ts`

**Dashboard:**
- `client/src/pages/Dashboard/Dashboard.tsx`
- `client/src/pages/Dashboard/Dashboard.module.scss`
- `client/src/components/DreamCard/DreamCard.tsx`
- `client/src/components/DreamCard/DreamCard.module.scss`
- `client/src/redux/api/dreamsApi.ts`
- `client/src/redux/slices/dreamsSlice.ts`

**Dream Editor:**
- `client/src/pages/DreamEditor/DreamEditor.tsx`
- `client/src/pages/DreamEditor/DreamEditor.module.scss`
- `client/src/validation/dreamValidation.ts`

---

## ✨ Features

### Core Functionality
- **Dream Management** - Full CRUD operations with rich text editing
- **Trash Bin System** - Soft delete with 30-day auto-removal (MongoDB TTL Index)
- **Advanced Search & Sort** - Find dreams by keywords, dates, moods, and symbols

### AI-Powered Analysis
- **Mood Detection** - Automatic emotional analysis of dream content
- **Symbol Recognition** - Identifies recurring symbols and archetypes
- **Dream Interpretation** - AI-generated insights and meanings
- **Auto Language Detection** - Supports multilingual dream entries

### Insights & Visualization
- **Interactive Dashboard** - Recharts-powered data visualizations
- **Dream Patterns** - Track recurring themes over time
- **Mood Trends** - Visualize emotional patterns across entries

### User Experience
- **Landing Page** - Samsung-style scroll-driven animations
- **Dark/Light Mode** - Midnight dark theme (default) with light mode toggle
- **Glassmorphism UI** - Modern, elegant design language
- **Skeleton Loaders** - Smooth loading states
- **Toast Notifications** - Real-time feedback

### Account & Security
- **JWT Authentication** - Secure HTTP-only cookie-based auth
- **Welcome Emails** - Nodemailer integration for onboarding
- **Profile Customization** - Cloudinary-powered avatar uploads

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React (Vite) | UI Framework |
| TypeScript | Type Safety |
| Redux Toolkit | State Management |
| RTK Query | API Data Fetching |
| SCSS Modules | Styling |
| Framer Motion | Animations |
| Recharts | Data Visualization |
| Zod | Form Validation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web Framework |
| TypeScript | Type Safety |
| MongoDB | Database |
| Mongoose | ODM |
| Zod | Request Validation |
| JWT | Authentication |
| Nodemailer | Email Service |
| Cloudinary | Image Storage |

---

## 📁 Project Structure

```
nightlog/
├── client/                    # React Frontend
│   ├── public/
│   │   └── moon-icon.svg      # Favicon
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Reusable components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── redux/             # Redux store & slices
│   │   ├── services/          # API service layer
│   │   ├── styles/            # Global SCSS & variables
│   │   ├── validation/        # Zod schemas
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── config/            # Environment & DB config
│   │   ├── controllers/       # Route controllers
│   │   ├── middlewares/       # Custom middlewares
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   ├── validation/        # Zod schemas
│   │   └── index.ts           # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- MongoDB >= 6.x
- npm or yarn

### Environment Variables

Create `.env` files in both `client/` and `server/` directories:

**Server (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nightlog
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE=604800000

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Service
AI_API_KEY=your-ai-api-key
```

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nightlog.git
   cd nightlog
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start development servers**

   In separate terminals:
   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 📜 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Dreams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dreams` | Get all user dreams |
| GET | `/api/dreams/:id` | Get single dream |
| POST | `/api/dreams` | Create new dream |
| PUT | `/api/dreams/:id` | Update dream |
| DELETE | `/api/dreams/:id` | Soft delete (to trash) |
| POST | `/api/dreams/:id/restore` | Restore from trash |
| DELETE | `/api/dreams/:id/permanent` | Permanent delete |

### Trash
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trash` | Get trashed dreams |
| DELETE | `/api/trash/empty` | Empty trash |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis/analyze` | Analyze dream content |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/avatar` | Upload avatar |

### Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/insights/stats` | Get dream statistics |
| GET | `/api/insights/moods` | Get mood distribution |
| GET | `/api/insights/symbols` | Get symbol frequency |

---

## 🎨 Design System

### Color Palette

**Dark Mode (Default)**
```scss
$bg-primary: #0a0a0f;
$bg-secondary: #12121a;
$bg-glass: rgba(255, 255, 255, 0.05);
$accent-primary: #6366f1;
$accent-secondary: #8b5cf6;
$text-primary: #f8fafc;
$text-secondary: #94a3b8;
```

**Light Mode**
```scss
$bg-primary: #f8fafc;
$bg-secondary: #ffffff;
$bg-glass: rgba(0, 0, 0, 0.02);
$accent-primary: #4f46e5;
$accent-secondary: #7c3aed;
$text-primary: #1e293b;
$text-secondary: #64748b;
```

---

## 🔧 Scripts

### Server
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Client
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📝 Git Workflow

This project follows a strict branching strategy:

1. **Never commit directly to `main`**
2. **Create feature branches** for each module:
   - `feature/auth-setup`
   - `feature/landing-page`
   - `feature/dream-crud`
   - `feature/ai-analysis`
   - `feature/insights-dashboard`

3. **Use Conventional Commits**:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code restructuring
   - `test:` - Adding tests
   - `chore:` - Maintenance

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

> **Note:** Only run `npm run build` when deploying to production. For development, use `npm run dev` instead.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Moon icon designed for NightLog
- Inspired by the beauty of dreams and the power of self-reflection

---

<p align="center">
  <strong>NightLog</strong> - Where Dreams Become Insights
</p>
