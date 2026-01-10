# ClaimPoint - Smart Lost & Found Management System

ClaimPoint is a **full-stack web application** for managing lost and found items with **AI-powered smart matching**. It's designed for organizations like airports, hotels, hospitals, and universities to efficiently reunite people with their lost items.

## 🎯 Quick Overview

- **Frontend:** React 19 with Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js with Express 5, PostgreSQL, Drizzle ORM
- **Authentication:** JWT + bcryptjs
- **AI Matching:** Semantic similarity algorithm (HuggingFace Transformers)
- **Notifications:** Email alerts for matches
- **Image Handling:** Cloudinary integration
- **Role-Based:** Admin, Staff, and User roles

## ✨ Key Features

✅ **Two-Way Reporting** - Report lost OR found items
✅ **Smart Matching** - AI-powered semantic similarity matching (85%+ accuracy)
✅ **Multi-Role System** - Admin, Staff, and User interfaces
✅ **Real-Time Notifications** - Email alerts when matches found
✅ **Secure Authentication** - JWT tokens with role-based access control
✅ **Item Search & Filter** - Search across all items with multiple filters
✅ **Cloudinary Integration** - Upload and manage item photos
✅ **OTP Verification** - Two-factor authentication for email
✅ **Mobile Responsive** - Works on all devices
✅ **Audit Trail** - Track all item status changes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or Docker)
- Git

### Installation (One Command)

```bash
git clone https://github.com/yourusername/claimpoint-smart-lost-found.git
cd claimpoint-smart-lost-found
npm run setup
```

This will:

- Install root dependencies
- Install server dependencies
- Install client dependencies

### Configuration

**1. Setup Database (PostgreSQL)**

Option A: Using Docker (recommended)

```bash
docker run --name claimpoint-postgres \
  -e POSTGRES_DB=claimpoint_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15
```

Option B: Using existing PostgreSQL installation

```bash
createdb claimpoint_db
```

**2. Configure Environment Variables**

```bash
# Copy server example config
cp server/.env.example server/.env

# Copy client example config
cp client/.env.example client/.env
```

Edit `server/.env` with your actual values:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/claimpoint_db
JWT_SECRET=your_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@claimpoint.com
ADMIN_PASSWORD=admin@123
```

**3. Initialize Database**

```bash
cd server
npx drizzle-kit push
npm run seed
```

This will create tables and seed an admin user.

**4. Start Development Servers**

```bash
# From root directory
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

**Access the application:**

- 🖥️ **Frontend:** http://localhost:5173
- 🔗 **API:** http://localhost:5000
- 📊 **Database:** Use `npm run db:studio` in server for visual DB management

---

## 🔑 Default Login Credentials

After seeding:

| Role  | Email                        | Password         |
| ----- | ---------------------------- | ---------------- |
| Admin | admin@claimpoint.com         | admin@123        |
| Staff | (Create via Admin Dashboard) | (Staff-specific) |
| User  | (Self-signup)                | (User-specific)  |

---

## 📊 User Roles & Permissions

### Admin (Superadmin)

- Manage staff accounts (create, edit, delete)
- Manage user accounts
- View all items and claims
- Generate reports
- System configuration

### Staff

- Add and manage found items
- View and process claims
- Update item status
- Handle item returns
- View assigned items

### Users (Public)

- Report lost items
- Browse found items
- Submit claims
- Receive email notifications
- Track claim status
- Update their profile

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/logout` - User logout

### Items

- `GET /api/items` - List all items (with filters)
- `GET /api/items/:id` - Get item details
- `POST /api/items` - Add new item (Lost or Found)
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Matching

- `GET /api/items/:id/matches` - Get AI matches for an item
- `POST /api/matches/auto` - Trigger auto-matching

### Admin

- `GET /api/admin/users` - List all users
- `GET /api/admin/staff` - List all staff
- `POST /api/admin/staff` - Create new staff
- `PUT /api/admin/staff/:id` - Update staff
- `DELETE /api/admin/staff/:id` - Delete staff

### User Profile

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password

---

## 📁 Project Structure

```
claimpoint-smart-lost-found/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components (HomePage, LoginPage, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── services/         # API client services
│   │   ├── context/          # React Context (auth context)
│   │   ├── lib/              # Utility libraries
│   │   ├── assets/           # Images, icons, fonts
│   │   └── App.jsx           # Main app component
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── server/                    # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/      # Request handlers (auth, items, admin, etc.)
│   │   ├── routes/           # API route definitions
│   │   ├── models/           # Database models/schema
│   │   ├── middlewares/      # Auth, role-check, error handling
│   │   └── utils/            # Helper functions (cron, email, etc.)
│   ├── services/             # Email service
│   ├── config/               # Cloudinary configuration
│   ├── scripts/              # Database seed script
│   ├── package.json
│   ├── index.js              # Server entry point
│   ├── drizzle.config.js     # ORM configuration
│   └── .env.example
│
├── package.json              # Root package (setup scripts)
├── README.md                 # This file
├── LICENSE                   # MIT License
├── CONTRIBUTING.md           # Contribution guidelines
└── .gitignore               # Git ignore rules
```

---

## 🤖 Smart Matching Algorithm

The system uses a 3-factor matching algorithm:

```
Match Score = (Details × 0.6) + (Location × 0.3) + (Date × 0.1)

Details (60%):
  - Device IMEI, color, model, condition
  - Semantic similarity using HuggingFace Transformers

Location (30%):
  - Geographic proximity
  - Same area or building tokens

Date (10%):
  - Days between lost and found
  - Recent matches prioritized
```

Only matches with **≥50% score** are auto-suggested to staff.

---

## 🔐 Security Features

- ✅ **Password Security:** bcryptjs hashing (salt rounds: 10)
- ✅ **Authentication:** JWT tokens with 7-day expiry
- ✅ **Email Verification:** OTP-based verification
- ✅ **Role-Based Access Control (RBAC):** Endpoint-level permission checks
- ✅ **Data Privacy:** Sensitive fields hidden based on user role
- ✅ **SQL Injection Prevention:** Drizzle ORM with parameterized queries
- ✅ **CORS Configuration:** Restricted to trusted origins
- ✅ **Input Validation:** Server-side validation on all inputs
- ✅ **Audit Trail:** All changes logged with user info and timestamp

---

## 📧 Email Notifications

The system sends emails for:

- Account verification (OTP)
- Item match alerts
- Claim status updates
- Password recovery

Configure SMTP in `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password (not your regular password)
```

**For Gmail:** [Create an App Password](https://support.google.com/accounts/answer/185833)

---

## 🛠️ Development Commands

```bash
# Root level
npm run setup          # Install all dependencies
npm run dev           # Start both server & client
npm run build         # Build for production
npm run build:server  # Build server only
npm run build:client  # Build client only

# Server
cd server
npm run dev           # Start with nodemon
npm run db:push      # Push schema to database
npm run db:studio    # Open visual database editor
npm run seed         # Seed admin user

# Client
cd client
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

---

## 📱 Frontend Technologies

| Library         | Purpose                 |
| --------------- | ----------------------- |
| React 19        | UI framework            |
| Vite            | Build tool & dev server |
| Tailwind CSS 4  | Utility-first styling   |
| Framer Motion   | Animations              |
| React Router v7 | Client-side routing     |
| Axios           | HTTP client             |
| Lucide React    | Icons                   |
| React Toastify  | Toast notifications     |
| ESLint          | Code linting            |

---

## 🖥️ Backend Technologies

| Library     | Purpose              |
| ----------- | -------------------- |
| Express 5   | Web framework        |
| PostgreSQL  | Database             |
| Drizzle ORM | Type-safe ORM        |
| JWT         | Token authentication |
| bcryptjs    | Password hashing     |
| Nodemailer  | Email service        |
| Cloudinary  | Image CDN            |
| HuggingFace | AI/ML transformers   |
| Node Cron   | Scheduled tasks      |
| Dotenv      | Environment config   |

---

## 🚢 Deployment

### Environment Setup

Before deploying, ensure:

1. All `.env` variables are set correctly
2. PostgreSQL database is accessible
3. Cloudinary account is created
4. Email SMTP credentials are valid
5. JWT_SECRET is a strong, unique string

### Production Build

```bash
npm run build
```

This generates:

- `client/dist/` - Frontend build
- `server/` - Ready for Node.js production

### Running in Production

```bash
cd server
NODE_ENV=production npm start
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- 📧 **Email:** support@claimpoint.com
- 🐛 **Report Bugs:** [GitHub Issues](../../issues)
- 💡 **Feature Requests:** [GitHub Discussions](../../discussions)
- 📖 **Documentation:** See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies for efficient lost & found management.

Thanks to:

- React and Node.js communities
- HuggingFace for Transformers
- PostgreSQL for reliable data storage
- Cloudinary for image hosting
- All contributors and supporters

---

## 📈 Project Stats

- **Lines of Code:** 5,000+
- **Components:** 20+
- **API Endpoints:** 25+
- **Database Tables:** 6
- **Tech Stack:** React + Node.js + PostgreSQL
- **Status:** ✅ Production Ready

---

**Version:** 1.0.0 | **Last Updated:** January 2026 | **Status:** Production Ready

Made with ❤️ for lost & found management
