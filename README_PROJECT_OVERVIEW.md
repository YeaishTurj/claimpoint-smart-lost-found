# ClaimPoint — Smart Lost & Found Management System

ClaimPoint is a full-stack, AI-powered lost & found platform designed for organizations (universities, stations, malls, etc.) to digitize and streamline lost item management. It features role-based dashboards (Admin, Staff, User), secure authentication, and a smart matching engine for claim verification.

---

## 🏗️ System Architecture

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js (ESM) + Express 5
- **Database:** PostgreSQL + Drizzle ORM
- **AI Matching:** Local embeddings + cosine similarity (HuggingFace Transformers)
- **Auth:** JWT (HTTP-only cookie)
- **Email:** Nodemailer (OTP, notifications)
- **Images:** Cloudinary

```
┌─────────────────────────────┐
│      ClaimPoint Platform    │
├─────────────┬───────────────┤
│ Public Web  │ Admin/Staff   │
│ (React)     │ Panel (React) │
├─────────────┴───────────────┤
│ REST API (Express.js)       │
│  - Auth, Item, User, Staff, │
│    Admin routes             │
├─────────────┬───────────────┤
│ PostgreSQL  │ Email Service │
│ Cloudinary  │ (Nodemailer)  │
└─────────────┴───────────────┘
```

---

## 👤 User Roles & Capabilities

### USER (General Public)

- Register & verify email (OTP)
- Report lost items
- Browse found items
- Claim found items (provide proof)
- Track claim/report status
- View & update profile

### STAFF (Organization Personnel)

- Add found items (with public & hidden details, photos)
- Update/delete found items
- Review AI-suggested matches (with match %)
- Approve/reject matches
- Review user claims (sorted by match %)
- Approve/reject claims
- Mark items as collected
- Dashboard for all items/claims

### ADMIN (Organization Management)

- Manage staff (add, edit, view)
- Manage users (activate/deactivate)
- System statistics & overview
- Role-based access control

---

## 🔄 System Workflow

### 1. User Loses Item (Auto-Match Path)

```
User reports lost item
  ↓
Staff finds similar item & adds to system
  ↓
AI automatically matches (e.g., 87%)
  ↓
Staff reviews & approves match
  ↓
User notified via email
  ↓
User visits & collects with ID
  ↓
Status updated to RESOLVED
```

### 2. User Claims Found Item

```
User sees found item on website
  ↓
User claims with proof details (IMEI, photos, etc.)
  ↓
AI calculates match % (e.g., 82%)
  ↓
Staff reviews multiple claims (sorted by match %)
  ↓
Staff approves highest match
  ↓
User notified
  ↓
User collects with ID
  ↓
Status updated to COLLECTED
```

---

## 🤖 Smart Matching Algorithm

- **Details Similarity:** 60% (brand, color, description)
- **Location Proximity:** 30% (same/nearby location)
- **Date Proximity:** 10% (found/lost date closeness)
<!-- - **Threshold:** ≥50% to suggest match -->
- **AI Model:** Local embeddings (cosine similarity)
- **Staff Review:** All matches require human approval

---

## 🔒 Data Security

- **Hidden Details:** Only staff can see (IMEI, serial, engravings)
- **Public Details:** Shown to all (brand, color, model)
- **Claims:** Users must provide proof; staff compare with hidden details
- **Role-based access:** Admin, Staff, User

---

## 🗄️ Database Schema (Key Tables)

- **users** — All people (roles: user, staff, admin)
- **found_items** — Items found on premises
- **lost_reports** — Items reported lost
- **claims** — Users claiming found items
- **item_matches** — AI-suggested matches

---

## 🚦 API Overview

- **/auth** — Login, register, OTP, etc.
- **/user** — Lost reports, claims, profile
- **/staff** — Found items, matches, claims
- **/admin** — Staff/user management

---

## 🛠️ Setup & Installation

```bash
# Install dependencies
npm run setup

# Configure environment
cd server && cp .env.example .env
# (Edit .env with DB, email, cloudinary credentials)

# Setup database
npx drizzle-kit push

# Seed admin
npm run seed

# Run
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 💡 Key Features

- Secure registration & OTP
- AI-powered matching
- Email notifications
- Role-based dashboards
- Mobile-friendly UI
- Image uploads (Cloudinary)
- Data privacy (hidden/public details)

---

## ❓ FAQ

- **How is data kept secure?**
  - Hidden details are only visible to staff; public details are safe for all.
- **Can users see hidden details?**
  - No. Only staff can view and use them for verification.
- **How accurate is the AI matching?**
  - 85–95% for matches >70% score; all matches require staff approval.
- **What if multiple people claim the same item?**
  - Staff reviews all claims, sorted by match %; highest match is prioritized.

---

## 📈 Future Enhancements

- Multi-language support
- SMS notifications
- Advanced analytics
- Mobile app

---

## 📄 License

MIT

---

## 👥 Contributors

See CONTRIBUTORS.md
