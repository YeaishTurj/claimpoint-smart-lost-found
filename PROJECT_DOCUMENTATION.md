# ClaimPoint - Smart Lost & Found Platform

## Complete Project Documentation

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Backend API Documentation](#backend-api-documentation)
6. [Frontend Pages & Components](#frontend-pages--components)
7. [Core Workflows](#core-workflows)
8. [AI-Powered Matching System](#ai-powered-matching-system)
9. [Authentication & Security](#authentication--security)
10. [Email Notification System](#email-notification-system)

---

## Project Overview

**ClaimPoint** is a comprehensive web-based Lost & Found Management System designed for organizations like railway stations, airports, universities, hospitals, and other public facilities. It digitizes and automates the traditional manual process of recording, tracking, and returning lost items.

### Key Features

- ✅ **Role-Based Access Control**: Admin, Staff, and User roles with distinct permissions
- ✅ **AI-Powered Matching**: Automatic matching of lost reports with found items using ML similarity scoring
- ✅ **Dynamic Field System**: Flexible item details storage (no hardcoded fields)
- ✅ **Dual-Detail System**: Public details (shown to users) + Hidden details (backend verification)
- ✅ **Email Notifications**: Automated notifications for registrations, claims, and matches
- ✅ **Image Upload Support**: Cloudinary integration for item images
- ✅ **Real-time Updates**: Instant status updates across the platform
- ✅ **Comprehensive Dashboard**: Separate dashboards for each user role

### Technology Stack

**Backend:**

- Node.js + Express.js
- PostgreSQL database
- Drizzle ORM
- JWT authentication
- Bcrypt password hashing
- Nodemailer for emails
- Hugging Face Transformers (AI matching)

**Frontend:**

- React 18
- React Router v7
- Tailwind CSS
- Lucide React (icons)
- React Toastify (notifications)
- Axios (API client)
- Framer Motion (animations)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React)                          │
│  ┌──────────┬──────────┬──────────┬──────────────────────┐ │
│  │  Admin   │  Staff   │   User   │   Public (Browse)    │ │
│  │Dashboard │Dashboard │Dashboard │   Found Items        │ │
│  └──────────┴──────────┴──────────┴──────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST API
┌───────────────────────▼─────────────────────────────────────┐
│                   SERVER (Express.js)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                    │  │
│  │  - Authentication (JWT)                              │  │
│  │  - Role Authorization                                │  │
│  │  - CORS, Cookie Parser                               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Route Handlers                                      │  │
│  │  /api/auth   /api/admin   /api/staff               │  │
│  │  /api/user   /api/items                             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers                                         │  │
│  │  - Auth Controller (register, login, verify)        │  │
│  │  - Admin Controller (staff/user management)         │  │
│  │  - Staff Controller (items, claims, matches)        │  │
│  │  - User Controller (reports, claims)                │  │
│  │  - Item Controller (public browsing)                │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services                                            │  │
│  │  - Auto Match Service (AI matching engine)          │  │
│  │  - Local Matcher (ML similarity scoring)            │  │
│  │  - Email Service (notifications)                    │  │
│  │  - Cron Jobs (cleanup tasks)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ Drizzle ORM
┌───────────────────────▼─────────────────────────────────────┐
│                PostgreSQL Database                          │
│  Tables: users, users_pending, found_items,                │
│          claims, lost_reports, item_matches                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### 1. **users** (Main Users Table)

Stores verified users with active accounts.

| Field          | Type      | Description                     |
| -------------- | --------- | ------------------------------- |
| id             | UUID      | Primary key                     |
| email          | VARCHAR   | Unique email address            |
| password       | TEXT      | Bcrypt hashed password          |
| full_name      | VARCHAR   | User's full name                |
| phone          | VARCHAR   | Contact phone number (optional) |
| role           | ENUM      | ADMIN / STAFF / USER            |
| is_active      | BOOLEAN   | Account active status           |
| email_verified | BOOLEAN   | Email verification status       |
| created_at     | TIMESTAMP | Account creation timestamp      |
| updated_at     | TIMESTAMP | Last update timestamp           |

### 2. **users_pending** (Temporary Registration Table)

Stores unverified user registrations with OTP.

| Field                 | Type      | Description                  |
| --------------------- | --------- | ---------------------------- |
| id                    | UUID      | Primary key                  |
| email                 | VARCHAR   | Email (unique)               |
| password              | TEXT      | Pre-hashed password          |
| full_name             | VARCHAR   | User's name                  |
| phone                 | VARCHAR   | Phone number (optional)      |
| role                  | ENUM      | Default: USER                |
| otp_verification_code | VARCHAR   | 6-digit OTP code             |
| otp_expires_at        | TIMESTAMP | OTP expiration time          |
| otp_attempts          | INTEGER   | Failed verification attempts |
| created_at            | TIMESTAMP | Registration timestamp       |

### 3. **found_items** (Items Found by Staff)

Staff-created records of found items.

| Field          | Type      | Description                              |
| -------------- | --------- | ---------------------------------------- |
| id             | UUID      | Primary key                              |
| item_type      | TEXT      | Category (Phone, Wallet, Keys, etc.)     |
| staff_id       | UUID      | Foreign key → users.id (staff who found) |
| date_found     | TIMESTAMP | When the item was found                  |
| location_found | TEXT      | Where the item was found                 |
| hidden_details | JSON      | Backend-only verification details        |
| public_details | JSON      | Safe public-facing information           |
| image_urls     | JSON      | Array of Cloudinary image URLs           |
| status         | ENUM      | FOUND / CLAIMED / RETURNED               |
| created_at     | TIMESTAMP | Record creation time                     |
| updated_at     | TIMESTAMP | Last update time                         |

**Status Flow:** `FOUND` → `CLAIMED` (when user claim approved) → `RETURNED` (when collected)

### 4. **claims** (User Claims for Found Items)

Users submit claims for items they believe belong to them.

| Field            | Type      | Description                               |
| ---------------- | --------- | ----------------------------------------- |
| id               | UUID      | Primary key                               |
| found_item_id    | UUID      | Foreign key → found_items.id              |
| user_id          | UUID      | Foreign key → users.id                    |
| claim_details    | JSON      | User's proof/description                  |
| image_urls       | JSON      | Evidence images from user                 |
| match_percentage | INTEGER   | AI-calculated similarity (0-100)          |
| status           | ENUM      | PENDING / APPROVED / REJECTED / COLLECTED |
| created_at       | TIMESTAMP | Claim submission time                     |
| updated_at       | TIMESTAMP | Last status update                        |

**Status Flow:** `PENDING` → `APPROVED` (staff approves) → `COLLECTED` (item handed over)

### 5. **lost_reports** (User-Reported Lost Items)

Users report items they've lost, system auto-matches with found items.

| Field          | Type      | Description                     |
| -------------- | --------- | ------------------------------- |
| id             | UUID      | Primary key                     |
| user_id        | UUID      | Foreign key → users.id          |
| item_type      | TEXT      | Item category                   |
| report_details | JSON      | User's description of lost item |
| date_lost      | TIMESTAMP | When the item was lost          |
| location_lost  | TEXT      | Where the item was lost         |
| image_urls     | JSON      | Optional reference images       |
| status         | ENUM      | OPEN / MATCHED / RESOLVED       |
| created_at     | TIMESTAMP | Report creation time            |
| updated_at     | TIMESTAMP | Last update time                |

**Status Flow:** `OPEN` → `MATCHED` (AI finds match + staff approves) → `RESOLVED` (item collected)

### 6. **item_matches** (AI-Generated Match Suggestions)

Stores automatic matches between lost reports and found items.

| Field          | Type      | Description                       |
| -------------- | --------- | --------------------------------- |
| id             | UUID      | Primary key                       |
| lost_report_id | UUID      | Foreign key → lost_reports.id     |
| found_item_id  | UUID      | Foreign key → found_items.id      |
| match_score    | INTEGER   | Combined similarity score (0-100) |
| status         | TEXT      | PENDING / APPROVED / REJECTED     |
| created_at     | TIMESTAMP | Match creation time               |

**Status Flow:** `PENDING` (AI suggests) → `APPROVED` (staff confirms) or `REJECTED` (false match)

---

## User Roles & Permissions

### 🔴 ADMIN Role

**Purpose:** System administrators with full control.

**Capabilities:**

- ✅ Create staff accounts
- ✅ Update staff information
- ✅ View all staff members
- ✅ View all users
- ✅ Activate/Deactivate user accounts
- ✅ Monitor system-wide activities
- ❌ Cannot directly manage items/claims (staff responsibility)

**Frontend Pages:**

- Admin Dashboard
- Manage Users (`/manage-users`)
- Add Staff (`/add-staff`)
- Manage Staffs (`/manage-staffs`)
- Update Staff (`/update-staff/:staffId`)

**Backend Endpoints:**

```
POST   /api/admin/staffs              - Create staff account
PATCH  /api/admin/staffs/:staffId     - Update staff details
GET    /api/admin/staffs              - Get all staff members
GET    /api/admin/staffs/:staffId     - Get single staff details
GET    /api/admin/users               - Get all users
PATCH  /api/admin/users/:userId/deactivate - Deactivate user
PATCH  /api/admin/users/:userId/activate   - Activate user
```

---

### 🟢 STAFF Role

**Purpose:** Front-desk/operational staff managing lost & found operations.

**Capabilities:**

- ✅ Add found items with dynamic fields
- ✅ Update/delete found items they created
- ✅ View all user claims on found items
- ✅ Approve/reject claims (triggers AI matching)
- ✅ Mark claims as collected
- ✅ View all lost reports from users
- ✅ **View AI-suggested matches** (item_matches table)
- ✅ **Approve/reject AI matches** (triggers user notification)
- ✅ **Mark matched items as collected** (resolves report)

**Frontend Pages:**

- Staff Dashboard
- Add Found Item (`/add-found-item`)
- Manage Items (`/manage-items`)
- Update Item (`/update-item/:itemId`)
- Manage Claims (`/manage-claims`)
- Manage Lost Reports (`/manage-lost-reports`)
- **Manage Matches** (`/manage-matches`) - AI match review

**Backend Endpoints:**

```
POST   /api/staff/found-items              - Add found item (triggers auto-match)
PATCH  /api/staff/found-items/:itemId      - Update found item
DELETE /api/staff/found-items/:itemId      - Delete found item

GET    /api/staff/claims                   - Get all claims
GET    /api/staff/claims/:claimId          - Get claim details
PATCH  /api/staff/claims/:claimId          - Update claim status

GET    /api/staff/lost-reports             - Get all lost reports
GET    /api/staff/lost-reports/:reportId   - Get report details

GET    /api/staff/matches                  - Get all AI matches
PATCH  /api/staff/matches/:matchId/approve - Approve match (notify user)
PATCH  /api/staff/matches/:matchId/reject  - Reject false match
PATCH  /api/staff/matches/:matchId/collected - Mark as collected (resolve)
```

---

### 🔵 USER Role

**Purpose:** General public users who lost items or want to claim found items.

**Capabilities:**

- ✅ Browse found items (public listings with limited details)
- ✅ View found item details (only public_details, not hidden)
- ✅ Submit claims for found items with proof
- ✅ View own claim status and history
- ✅ Delete pending claims
- ✅ Report lost items (triggers auto-matching)
- ✅ View own lost reports
- ✅ Update/delete own lost reports
- ✅ View match notifications when staff approves
- ❌ Cannot see other users' reports/claims

**Frontend Pages:**

- User Dashboard
- Browse Found Items (`/found-items`)
- Claim Item (`/claim-item/:itemId`)
- My Dashboard (`/my-dashboard`) - Claims & Reports tabs
- Add Lost Item Report (`/add-lost-item`)
- Update Report (`/update-report/:reportId`)
- My Profile (`/my-profile`)
- Update Profile (`/update-profile`)
- Change Password (`/change-password`)

**Backend Endpoints:**

```
POST   /api/user/lost-reports           - Report lost item
GET    /api/user/lost-reports           - Get my reports
GET    /api/user/lost-reports/:id       - Get report details
PATCH  /api/user/lost-reports/:id       - Update my report
DELETE /api/user/lost-reports/:id       - Delete my report

POST   /api/user/claims/:id             - Submit claim for found item
GET    /api/user/claims                 - Get my claims
GET    /api/user/claims/:id             - Get claim details
DELETE /api/user/claims/:id             - Delete my claim
```

---

### 🌍 PUBLIC (Unauthenticated)

**Capabilities:**

- ✅ View home page
- ✅ Browse found items (public_details only)
- ✅ Register for account
- ✅ Login
- ❌ Cannot submit claims or reports

**Frontend Pages:**

- Home (`/`)
- Browse Found Items (`/found-items`)
- Login (`/login`)
- Register (`/register`)
- Verify Email (`/verify-email`)

---

## Backend API Documentation

### Authentication Endpoints (`/api/auth`)

#### 1. Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890"
}
```

**Process:**

1. Validates input (email format, password strength)
2. Checks if email already exists in `users` or `users_pending`
3. Hashes password with bcrypt
4. Generates 6-digit OTP
5. Stores in `users_pending` table
6. Sends OTP via email
7. Returns success message

**Response:**

```json
{
  "message": "Registration initiated. Please check your email for OTP."
}
```

#### 2. Verify Email

```http
GET /api/auth/verify-email?email=john@example.com&otp=123456
```

**Process:**

1. Finds pending user by email
2. Validates OTP (correct code, not expired, attempts < 5)
3. Moves user from `users_pending` → `users`
4. Deletes pending record
5. Generates JWT token
6. Sets HTTP-only cookie

**Response:**

```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "USER"
  }
}
```

#### 3. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Process:**

1. Validates email exists in `users`
2. Checks account is active
3. Compares password with bcrypt
4. Generates JWT token
5. Sets HTTP-only cookie

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "USER",
    "is_active": true
  }
}
```

#### 4. Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### 5. Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### 6. Update Profile

```http
PATCH /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Smith",
  "phone": "+1234567890"
}
```

#### 7. Change Password

```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

---

### Admin Endpoints (`/api/admin`)

**Requires:** JWT token + ADMIN role

#### 1. Add Staff

```http
POST /api/admin/staffs
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Staff Member Name",
  "email": "staff@example.com",
  "password": "staffPassword123",
  "phone": "+1234567890"
}
```

**Process:**

1. Validates admin role
2. Checks email uniqueness
3. Hashes password
4. Creates user with role = "STAFF"
5. Sends welcome email with credentials

#### 2. Get All Staffs

```http
GET /api/admin/staffs
Authorization: Bearer <token>
```

#### 3. Get Staff By ID

```http
GET /api/admin/staffs/:staffId
Authorization: Bearer <token>
```

#### 4. Update Staff

```http
PATCH /api/admin/staffs/:staffId
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Updated Name",
  "phone": "+9876543210"
}
```

#### 5. Get All Users

```http
GET /api/admin/users
Authorization: Bearer <token>
```

#### 6. Deactivate User

```http
PATCH /api/admin/users/:userId/deactivate
Authorization: Bearer <token>
```

#### 7. Activate User

```http
PATCH /api/admin/users/:userId/activate
Authorization: Bearer <token>
```

---

### Staff Endpoints (`/api/staff`)

**Requires:** JWT token + STAFF role

#### 1. Add Found Item

```http
POST /api/staff/found-items
Authorization: Bearer <token>
Content-Type: application/json

{
  "item_type": "Phone",
  "date_found": "2026-01-10T10:30:00Z",
  "location_found": "Platform 3, Railway Station",
  "hidden_details": {
    "imei": "123456789012345",
    "serial_number": "ABC123XYZ",
    "color": "Black",
    "brand": "Samsung",
    "model": "Galaxy S22"
  },
  "public_details": {
    "brand": "Samsung",
    "model": "Galaxy S22",
    "color": "Black"
  },
  "image_urls": [
    "https://res.cloudinary.com/xxx/image1.jpg",
    "https://res.cloudinary.com/xxx/image2.jpg"
  ]
}
```

**Process:**

1. Validates staff authentication
2. Validates required fields
3. Coerces details to JSON objects
4. Inserts into `found_items` table
5. **Triggers Auto-Match Service:**
   - Queries all OPEN lost reports with same `item_type`
   - Compares `report_details` vs `public_details` (AI similarity)
   - Compares `location_lost` vs `location_found` (Jaccard)
   - Combines scores: `70% details + 30% location`
   - If score ≥ 50%, creates entry in `item_matches` table
6. Returns found item + match count

**Response:**

```json
{
  "message": "Found item added and cross-checked with lost reports",
  "foundItem": {
    /* found item data */
  },
  "match_count": 2,
  "suggested_matches": [
    {
      "match_id": "uuid",
      "report_id": "uuid",
      "match_score": 85,
      "details_score": 88,
      "location_score": 75
    }
  ]
}
```

#### 2. Update Found Item

```http
PATCH /api/staff/found-items/:itemId
Authorization: Bearer <token>
```

#### 3. Delete Found Item

```http
DELETE /api/staff/found-items/:itemId
Authorization: Bearer <token>
```

#### 4. Get All Claims

```http
GET /api/staff/claims
Authorization: Bearer <token>
```

Returns all claims submitted by users for any found item.

#### 5. Get Claim Details

```http
GET /api/staff/claims/:claimId
Authorization: Bearer <token>
```

#### 6. Update Claim Status

```http
PATCH /api/staff/claims/:claimId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED"  // APPROVED / REJECTED / COLLECTED
}
```

**Process:**

- If `APPROVED`: Updates found_item status to CLAIMED, sends email to user
- If `REJECTED`: Sends rejection email
- If `COLLECTED`: Updates found_item to RETURNED, sends confirmation email

#### 7. Get All Lost Reports

```http
GET /api/staff/lost-reports
Authorization: Bearer <token>
```

#### 8. Get Report Details

```http
GET /api/staff/lost-reports/:reportId
Authorization: Bearer <token>
```

#### 9. **Get All Matches** (AI Suggestions)

```http
GET /api/staff/matches
Authorization: Bearer <token>
```

**Returns:**

```json
{
  "success": true,
  "count": 5,
  "matches": [
    {
      "match_id": "uuid",
      "match_score": 85,
      "match_status": "PENDING",
      "report_id": "uuid",
      "report_item_type": "Phone",
      "report_location": "Gate 5",
      "report_date": "2026-01-09",
      "report_details": {
        /* user's description */
      },
      "report_status": "OPEN",
      "found_item_id": "uuid",
      "found_item_type": "Phone",
      "found_item_location": "Platform 3",
      "found_item_date": "2026-01-10",
      "found_public_details": {
        /* public info */
      },
      "found_hidden_details": {
        /* backend info */
      }
    }
  ]
}
```

#### 10. **Approve Match**

```http
PATCH /api/staff/matches/:matchId/approve
Authorization: Bearer <token>
```

**Process:**

1. Validates staff owns the found item
2. Updates match status: `PENDING` → `APPROVED`
3. Updates lost report: `OPEN` → `MATCHED`
4. Sends email to user: "We found your item! Come collect it."

#### 11. **Reject Match**

```http
PATCH /api/staff/matches/:matchId/reject
Authorization: Bearer <token>
```

**Process:**

1. Validates staff owns the found item
2. Updates match status: `PENDING` → `REJECTED`
3. No notification sent

#### 12. **Mark Item Collected**

```http
PATCH /api/staff/matches/:matchId/collected
Authorization: Bearer <token>
```

**Process:**

1. Validates match is APPROVED
2. Updates lost report: `MATCHED` → `RESOLVED`
3. Updates found item: `FOUND` → `RETURNED`
4. Sends confirmation email: "Thank you for collecting your item"

---

### User Endpoints (`/api/user`)

**Requires:** JWT token + USER role

#### 1. Report Lost Item

```http
POST /api/user/lost-reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "item_type": "Wallet",
  "date_lost": "2026-01-08T14:30:00Z",
  "location_lost": "Terminal 2, Airport",
  "report_details": {
    "brand": "Gucci",
    "color": "Brown",
    "contains": "ID card, credit cards",
    "unique_marks": "Initials JD engraved"
  },
  "image_urls": ["https://cloudinary.com/wallet.jpg"]
}
```

**Process:**

1. Validates user authentication
2. Creates entry in `lost_reports` table with status = OPEN
3. **Automatically checked against existing found items** (auto-match runs on found item creation)

#### 2. Get My Reports

```http
GET /api/user/lost-reports
Authorization: Bearer <token>
```

#### 3. Get Report Details

```http
GET /api/user/lost-reports/:id
Authorization: Bearer <token>
```

#### 4. Update My Report

```http
PATCH /api/user/lost-reports/:id
Authorization: Bearer <token>
```

#### 5. Delete My Report

```http
DELETE /api/user/lost-reports/:id
Authorization: Bearer <token>
```

#### 6. Submit Claim

```http
POST /api/user/claims/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "claim_details": {
    "proof_of_ownership": "Purchase receipt",
    "imei": "123456789012345",
    "description": "Black Samsung phone with crack on screen"
  },
  "image_urls": ["https://cloudinary.com/receipt.jpg"]
}
```

**Process:**

1. Validates found item exists
2. Validates user hasn't already claimed this item
3. **Runs AI similarity check:**
   - Compares `claim_details` vs `hidden_details`
   - Generates match_percentage (0-100)
4. Creates claim with status = PENDING
5. Staff reviews and approves/rejects

#### 7. Get My Claims

```http
GET /api/user/claims
Authorization: Bearer <token>
```

#### 8. Get Claim Details

```http
GET /api/user/claims/:id
Authorization: Bearer <token>
```

#### 9. Delete My Claim

```http
DELETE /api/user/claims/:id
Authorization: Bearer <token>
```

---

### Item Endpoints (`/api/items`)

**Public access (optional authentication)**

#### 1. Get All Found Items

```http
GET /api/items/found-items?item_type=Phone&search=Samsung&location=Platform
```

**Query Parameters:**

- `item_type`: Filter by category
- `search`: Search in public details
- `location`: Filter by location

**Response:** Returns only `public_details`, not `hidden_details`

#### 2. Get Found Item By ID

```http
GET /api/items/found-items/:id
```

**Response:** Single item with public_details only

---

## Frontend Pages & Components

### Navigation Structure

```
Navbar (Role-Based)
├── Public (Not logged in)
│   ├── Home
│   ├── Browse Found Items
│   ├── Login
│   └── Register
│
├── USER Role
│   ├── Home
│   ├── Browse Found Items
│   ├── My Dashboard (Claims & Reports tabs)
│   ├── Add Lost Report
│   ├── My Profile
│   └── Logout
│
├── STAFF Role
│   ├── Home
│   ├── Manage Items
│   ├── Add Found Item
│   ├── Manage Claims
│   ├── Manage Lost Reports
│   ├── Manage Matches (AI suggestions)
│   └── Logout
│
└── ADMIN Role
    ├── Home
    ├── Manage Users
    ├── Manage Staffs
    ├── Add Staff
    └── Logout
```

### Page Descriptions

#### Public Pages

**1. HomePage.jsx**

- Hero section with platform overview
- Call-to-action for registration
- Quick access to browse found items

**2. BrowseFoundItems.jsx**

- Grid view of found items (public_details only)
- Search and filter by item_type, location
- Stats cards (total items, categories)
- Click to view details or claim

**3. LoginPage.jsx**

- Email/password login form
- Link to registration
- "Forgot password" placeholder

**4. RegisterPage.jsx**

- Registration form (name, email, password, phone)
- Terms & conditions checkbox
- Redirects to verification page

**5. VerificationPage.jsx**

- OTP input (6 digits)
- Resend OTP button
- Countdown timer
- Auto-login on success

---

#### User Pages

**6. MyDashboardPage.jsx**

- **Tab 1: My Claims**
  - Lists all claims user submitted
  - Status badges (PENDING/APPROVED/REJECTED/COLLECTED)
  - Action buttons (View Details, Delete)
  - Claim history with timestamps
- **Tab 2: My Lost Reports**
  - Lists all lost item reports
  - Status badges (OPEN/MATCHED/RESOLVED)
  - Edit/Delete buttons for OPEN reports
  - View match notifications if MATCHED

**7. AddLostItemReportPage.jsx**

- Dynamic form for reporting lost items
- Fields:
  - Item type selector
  - Date lost (date picker)
  - Location lost (text input)
  - Dynamic detail fields (key-value pairs)
  - Image upload (Cloudinary)
- Submit triggers auto-match in backend

**8. ClaimItemPage.jsx**

- Form to claim a found item
- Shows public_details of the item
- User provides:
  - Claim details (proof of ownership)
  - Evidence images
- AI calculates match percentage
- Staff reviews and approves/rejects

**9. UpdateReportPage.jsx**

- Edit existing lost report
- Can only edit OPEN reports
- Same form as AddLostItemReportPage

**10. MyProfilePage.jsx**

- View personal information
- Login history card
- Link to Update Profile
- Link to Change Password

**11. UpdateProfilePage.jsx**

- Update full_name, phone
- Cannot change email/password here

**12. ChangePasswordPage.jsx**

- Current password verification
- New password (with strength indicator)
- Confirm new password

---

#### Staff Pages

**13. ManageItemsPage.jsx**

- Lists all found items created by staff
- Stats cards (Total, Available, Claimed, Returned)
- Actions:
  - View details
  - Edit item
  - Delete item
- Status filters

**14. AddFoundItemPage.jsx**

- **Dynamic field system:**
  - Add unlimited fields with "Add Field" button
  - Toggle public/hidden for each field
  - Public fields → shown to users
  - Hidden fields → backend verification only
- Item type selector
- Date found, location found
- Multi-image upload (Cloudinary)
- On submit: Triggers auto-match

**15. UpdateItemPage.jsx**

- Edit found item details
- Same dynamic field system

**16. ManageClaimsPage.jsx**

- Lists all claims from users
- Shows:
  - User info (name, email)
  - Claimed item details
  - Match percentage
  - Claim details (user's proof)
- Actions:
  - View full details
  - Approve (notify user)
  - Reject (notify user)
  - Mark as Collected

**17. ManageLostReportsPage.jsx**

- Lists all lost reports from users
- Shows:
  - User contact info
  - Report details
  - Status (OPEN/MATCHED/RESOLVED)
- View button to see full report
- Helps staff check if found item matches any report

**18. ManageMatchesPage.jsx** ⭐ **Key Feature**

- Lists AI-generated matches between lost reports & found items
- **Each match card shows:**
  - **Left side:** Lost Report
    - Item type, location, date
    - Report details (expandable)
  - **Right side:** Found Item
    - Item type, location, date
    - Public details (expandable)
    - Hidden details (expandable, orange-colored)
  - **Match score:** Combined AI score (details 70% + location 30%)
  - **Status badge:** PENDING / APPROVED / REJECTED
- **Actions for PENDING matches:**
  - **Approve:** Updates report to MATCHED, emails user
  - **Reject:** Marks as false match
- **Action for APPROVED matches:**
  - **Mark as Collected:** Updates report to RESOLVED, item to RETURNED
- Filters: ALL / PENDING / APPROVED / REJECTED
- Search by item type or score

---

#### Admin Pages

**19. ManageUsersPage.jsx**

- Lists all users (role = USER)
- Shows: Name, email, phone, status
- Actions:
  - Activate account
  - Deactivate account
- Search and filters

**20. ManageStaffsPage.jsx**

- Lists all staff members (role = STAFF)
- Shows: Name, email, phone, created date
- Actions:
  - View details
  - Edit staff info
  - (Deactivation through user management)

**21. AddStaffPage.jsx**

- Form to create staff account
- Fields: Name, email, password, phone
- Sends welcome email with credentials

**22. UpdateStaffPage.jsx**

- Edit staff member information
- Cannot change email (unique identifier)

---

## Core Workflows

### Workflow 1: User Registration & Verification

```
1. User fills registration form (name, email, password, phone)
   ↓
2. Frontend: POST /api/auth/register
   ↓
3. Backend:
   - Validates input
   - Hashes password
   - Generates 6-digit OTP
   - Stores in users_pending table
   - Sends OTP email via Nodemailer
   ↓
4. User receives email with OTP
   ↓
5. User enters OTP on verification page
   ↓
6. Frontend: GET /api/auth/verify-email?email=xxx&otp=123456
   ↓
7. Backend:
   - Validates OTP (correct, not expired, attempts < 5)
   - Moves record: users_pending → users
   - Sets email_verified = true
   - Generates JWT token
   - Sets HTTP-only cookie
   ↓
8. User automatically logged in, redirected to dashboard
```

---

### Workflow 2: Staff Adds Found Item (Triggers Auto-Match)

```
1. Staff member finds item (or someone hands it in)
   ↓
2. Staff logs in and goes to "Add Found Item" page
   ↓
3. Staff fills form:
   - Item type: "Phone"
   - Date found: "2026-01-10"
   - Location: "Platform 3"
   - Public details: {"brand": "Samsung", "model": "S22", "color": "Black"}
   - Hidden details: {"imei": "123...", "serial": "ABC...", "scratch": "near camera"}
   - Upload images
   ↓
4. Frontend: POST /api/staff/found-items
   ↓
5. Backend:
   - Inserts into found_items table
   - Calls runAutoMatch(newFoundItem):

     a) Query all OPEN lost_reports with item_type = "Phone"

     b) For each report:
        - Compare report_details vs public_details (AI similarity)
        - Compare location_lost vs location_found (Jaccard)
        - Calculate combined score: 70% details + 30% location

     c) If score ≥ 50%:
        - Insert into item_matches table
        - Status: PENDING
        - Store match_score
   ↓
6. Backend returns:
   {
     "foundItem": {...},
     "match_count": 2,
     "suggested_matches": [...]
   }
   ↓
7. Staff sees notification: "Item added. 2 potential matches found."
   ↓
8. Staff can go to "Manage Matches" to review AI suggestions
```

---

### Workflow 3: User Reports Lost Item

```
1. User realizes they lost their phone
   ↓
2. User logs in and goes to "Add Lost Report"
   ↓
3. User fills form:
   - Item type: "Phone"
   - Date lost: "2026-01-09"
   - Location: "Gate 5"
   - Details: {"brand": "Samsung", "model": "Galaxy S22", "color": "Black", "scratch": "near camera"}
   - Upload reference image (optional)
   ↓
4. Frontend: POST /api/user/lost-reports
   ↓
5. Backend:
   - Inserts into lost_reports table
   - Status: OPEN
   - NOTE: Auto-match runs when staff ADDS found items, not when users report lost items
   ↓
6. User sees confirmation: "Report submitted. We'll notify you if we find your item."
   ↓
7. User waits. When staff adds matching found item later, auto-match triggers
   ↓
8. If match found (score ≥ 50%):
   - Entry created in item_matches (status: PENDING)
   - Staff reviews match in "Manage Matches"
   - If staff approves → user gets email notification
```

---

### Workflow 4: Staff Reviews AI Match & Approves

```
1. Staff opens "Manage Matches" page
   ↓
2. Sees list of PENDING matches:
   Match #1: Score 85%
   Lost Report: Phone, Platform 3, reported by John Doe
   Found Item: Phone, Platform 3, added by staff
   ↓
3. Staff clicks to expand details:
   - Left: Lost report details (what user described)
   - Right:
     * Public details (shown to users)
     * Hidden details (backend verification: IMEI, serial, etc.)
   ↓
4. Staff verifies:
   - "IMEI matches what user reported"
   - "Scratch description matches"
   - "Location and date align"
   ↓
5. Staff clicks "Approve"
   ↓
6. Confirmation modal appears
   ↓
7. Staff confirms
   ↓
8. Frontend: PATCH /api/staff/matches/:matchId/approve
   ↓
9. Backend:
   - Updates match: PENDING → APPROVED
   - Updates lost_report: OPEN → MATCHED
   - Sends email to user:
     "Good news! We found a match for your lost Phone. Please visit Platform 3 office to collect it."
   ↓
10. User receives email and comes to collect
    ↓
11. Upon physical verification and handover:
    - Staff clicks "Mark as Collected"
    - Frontend: PATCH /api/staff/matches/:matchId/collected
    ↓
12. Backend:
    - Updates lost_report: MATCHED → RESOLVED
    - Updates found_item: FOUND → RETURNED
    - Sends confirmation email: "Thank you for collecting your item"
    ↓
13. Workflow complete ✅
```

---

### Workflow 5: User Claims a Found Item (Manual Claim)

```
1. User browses "Found Items" page
   ↓
2. Sees item they think is theirs
   (Only public_details visible: "Samsung Galaxy S22, Black")
   ↓
3. User clicks "Claim This Item"
   ↓
4. Claim form appears:
   - User enters proof:
     {"imei": "123...", "serial": "ABC...", "purchase_date": "2025-12-01"}
   - Uploads receipt image
   ↓
5. Frontend: POST /api/user/claims/:itemId
   ↓
6. Backend:
   - Runs AI similarity check:
     Compare claim_details vs hidden_details (backend info)
   - Calculates match_percentage (0-100)
   - Creates claim entry with status: PENDING
   ↓
7. Staff opens "Manage Claims" page
   ↓
8. Sees claim:
   - Item: Samsung Phone
   - Claimed by: John Doe
   - Match: 92%
   - User proof: [shows claim_details]
   ↓
9. Staff verifies:
   - IMEI matches? ✅
   - Serial matches? ✅
   - Receipt shows correct model? ✅
   ↓
10. Staff clicks "Approve"
    ↓
11. Frontend: PATCH /api/staff/claims/:claimId { status: "APPROVED" }
    ↓
12. Backend:
    - Updates claim: PENDING → APPROVED
    - Updates found_item: FOUND → CLAIMED
    - Sends email: "Your claim approved. Visit office to collect."
    ↓
13. User collects item
    ↓
14. Staff clicks "Mark as Collected"
    ↓
15. Backend:
    - Updates claim: APPROVED → COLLECTED
    - Updates found_item: CLAIMED → RETURNED
    - Sends confirmation email
    ↓
16. Workflow complete ✅
```

---

## AI-Powered Matching System

### Overview

The system uses **Hugging Face Transformers** with the `all-MiniLM-L6-v2` model for semantic text similarity.

### Components

#### 1. **Local Matcher** (`server/services/localMatcher.js`)

```javascript
// Uses transformer-based embeddings
import { pipeline } from "@huggingface/transformers";

class MatcherPipeline {
  static model = "Xenova/all-MiniLM-L6-v2";
  // Feature extraction for text embeddings
}

export const getLocalMatchScore = async (userProof, hiddenDetails) => {
  // 1. Flattens JSON to text
  // 2. Cleans text (lowercase, remove stopwords, punctuation)
  // 3. Generates embeddings for both texts
  // 4. Calculates cosine similarity
  // 5. Returns percentage (0-100)
};
```

**Example:**

```javascript
const detailsScore = await getLocalMatchScore(
  { brand: "Samsung", model: "S22", color: "Black", scratch: "near camera" }, // report_details
  {
    brand: "Samsung",
    model: "Galaxy S22",
    color: "Black",
    scratch: "near camera",
  } // public_details
);
// Returns: { percentage: 86 }
```

#### 2. **Location Similarity** (`server/services/autoMatchService.js`)

```javascript
const locationSimilarity = (a, b) => {
  // Token-based Jaccard similarity
  // "Platform 3 Railway Station" vs "Platform 3 Station"
  // Tokens: {platform, 3, railway, station} vs {platform, 3, station}
  // Intersection: {platform, 3, station} = 3
  // Union: {platform, 3, railway, station} = 4
  // Similarity: 3/4 = 75%
};
```

#### 3. **Combined Score Calculation**

```javascript
const combinedScore = Math.round(
  detailsScore * 0.7 + // 70% weight for details similarity
    locationScore * 0.3 // 30% weight for location similarity
);

// Example:
// detailsScore = 88%
// locationScore = 75%
// combinedScore = (88 * 0.7) + (75 * 0.3) = 61.6 + 22.5 = 84%
```

#### 4. **Matching Criteria**

- **Item Type:** Must match exactly (Phone with Phone, Wallet with Wallet)
- **Status:** Only compares with OPEN lost reports
- **Threshold:** Combined score ≥ 50% → stored as PENDING match
- **Storage:** `item_matches` table with status: PENDING

#### 5. **When Matching Runs**

- **Trigger:** When staff adds a found item (POST /api/staff/found-items)
- **Process:**
  1. Insert found item into database
  2. Call `runAutoMatch(newFoundItem)`
  3. Auto-match runs in background
  4. Creates entries in `item_matches` for all matches ≥ 50%
- **Staff Review:** Staff views matches in "Manage Matches" page
- **Approval:** Staff manually approves/rejects each suggestion

---

## Authentication & Security

### JWT Token System

- **Token Generation:** On login/verification
- **Storage:** HTTP-only cookie (prevents XSS attacks)
- **Expiration:** 7 days
- **Claims:** `{ id, email, role }`

### Middleware Protection

```javascript
// authenticateToken - Verifies JWT
// roleAuthorization(role) - Checks user role
```

### Route Protection

```
/api/auth/*        → Public
/api/items/*       → Public (optional auth)
/api/admin/*       → Requires ADMIN role
/api/staff/*       → Requires STAFF role
/api/user/*        → Requires USER role
```

### Password Security

- **Hashing:** Bcrypt with salt rounds = 10
- **No plaintext storage:** All passwords hashed before database
- **Strength validation:** Minimum 8 characters on frontend

### Email Verification

- **OTP Length:** 6 digits
- **Expiration:** 10 minutes
- **Rate Limiting:** Max 5 attempts
- **Cleanup:** Expired pending users deleted by cron job (runs daily)

---

## Email Notification System

### Nodemailer Configuration

```javascript
// Gmail SMTP
transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App-specific password
  },
});
```

### Email Triggers

| Event          | Recipient | Content                                                    |
| -------------- | --------- | ---------------------------------------------------------- |
| Registration   | New user  | "Welcome! Your OTP is: 123456"                             |
| Claim Approved | User      | "Your claim approved! Come collect your item."             |
| Claim Rejected | User      | "Your claim was rejected. Contact support for details."    |
| Match Approved | User      | "We found your lost item! Visit office to verify."         |
| Item Collected | User      | "Thank you for collecting your item!"                      |
| Staff Created  | New staff | "Welcome to ClaimPoint! Your credentials: email, password" |

### Template System

```javascript
// server/src/utils/emailTemplates.js
export const generateClaimStatusTemplate = (userName, status, itemDetails) => {
  // Returns HTML email template
};
```

---

## Project Structure Summary

```
claimpoint-smart-lost-found/
│
├── server/
│   ├── index.js                    # Express app setup, route mounting
│   ├── drizzle.config.js          # Database configuration
│   ├── package.json               # Dependencies
│   │
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary setup
│   │
│   ├── services/
│   │   ├── autoMatchService.js    # AI matching engine
│   │   ├── localMatcher.js        # ML similarity scoring
│   │   └── email.js               # Email notifications
│   │
│   ├── scripts/
│   │   └── seed-admin.js          # Database seeding
│   │
│   └── src/
│       ├── index.js               # Database connection
│       │
│       ├── models/
│       │   ├── user.model.js      # Users & pending users tables
│       │   └── item.model.js      # Found items, claims, reports, matches
│       │
│       ├── controllers/
│       │   ├── auth.controller.js # Registration, login, verification
│       │   ├── admin.controller.js# Staff/user management
│       │   ├── staff.controller.js# Items, claims, matches management
│       │   ├── user.controller.js # Reports, claims submission
│       │   └── item.controller.js # Public item browsing
│       │
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── admin.routes.js
│       │   ├── staff.routes.js
│       │   ├── user.routes.js
│       │   └── item.routes.js
│       │
│       ├── middlewares/
│       │   ├── auth.middleware.js      # JWT verification
│       │   ├── roleAuth.middleware.js  # Role-based access
│       │   └── optionalAuth.middleware.js # Optional JWT
│       │
│       └── utils/
│           ├── cron.js                # Cleanup jobs
│           └── emailTemplates.js     # HTML email templates
│
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   │
│   └── src/
│       ├── main.jsx               # React app entry
│       ├── App.jsx                # Route configuration
│       │
│       ├── context/
│       │   └── auth.context.jsx   # Global auth state
│       │
│       ├── lib/
│       │   └── api.js             # Axios instance
│       │
│       ├── services/
│       │   └── api.js             # API helper functions
│       │
│       ├── components/
│       │   ├── Navbar.jsx         # Role-based navigation
│       │   └── Footer.jsx
│       │
│       └── pages/
│           ├── HomePage.jsx
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── VerificationPage.jsx
│           │
│           ├── (User Pages)
│           ├── MyDashboardPage.jsx
│           ├── AddLostItemReportPage.jsx
│           ├── ClaimItemPage.jsx
│           │
│           ├── (Staff Pages)
│           ├── AddFoundItemPage.jsx
│           ├── ManageItemsPage.jsx
│           ├── ManageClaimsPage.jsx
│           ├── ManageLostReportsPage.jsx
│           ├── ManageMatchesPage.jsx    ⭐ AI match review
│           │
│           └── (Admin Pages)
│               ├── ManageUsersPage.jsx
│               ├── ManageStaffsPage.jsx
│               └── AddStaffPage.jsx
│
└── PROJECT_DOCUMENTATION.md        # This file
```

---

## Key Features Deep Dive

### 1. Dynamic Field System

**Problem:** Different item types need different details.
**Solution:** JSON-based flexible field storage.

**Example:**

```javascript
// Phone found
{
  "public_details": {
    "brand": "Samsung",
    "model": "Galaxy S22"
  },
  "hidden_details": {
    "imei": "123456789012345",
    "serial": "ABC123",
    "scratch": "near camera",
    "apps_installed": ["WhatsApp", "Instagram"]
  }
}

// Wallet found
{
  "public_details": {
    "type": "Leather",
    "color": "Brown"
  },
  "hidden_details": {
    "contains": "VISA card ending 1234",
    "id_name": "John Doe",
    "unique_mark": "Initials JD"
  }
}
```

### 2. Dual Detail System

**Purpose:** Balance transparency with security.

- **Public Details:**

  - Shown to all users browsing found items
  - Helps users identify their items
  - No sensitive information
  - Example: Brand, model, color

- **Hidden Details:**
  - Only visible to staff
  - Used for verification
  - Contains unique identifiers
  - Example: IMEI, serial number, contents

### 3. Match Workflow

**Two Paths to Reunite Items:**

**Path A: AI Auto-Match (Lost Report → Found Item)**

1. User reports lost item
2. Staff adds matching found item later
3. AI auto-matches (≥50%)
4. Staff approves match
5. User notified
6. Item collected

**Path B: Manual Claim (Found Item → User Claim)**

1. Staff adds found item
2. User browses and sees their item
3. User submits claim with proof
4. AI calculates match percentage
5. Staff reviews and approves
6. Item collected

### 4. Status Progression

**Found Items:**

```
FOUND → CLAIMED → RETURNED
```

**Claims:**

```
PENDING → APPROVED → COLLECTED
```

**Lost Reports:**

```
OPEN → MATCHED → RESOLVED
```

**Matches:**

```
PENDING → APPROVED (or REJECTED)
```

---

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/claimpoint

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client (Vite)
VITE_API_BASE_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

---

## Conclusion

ClaimPoint is a production-ready, scalable lost & found management platform with:

- ✅ Role-based access control (Admin, Staff, User)
- ✅ AI-powered automatic matching (70% details + 30% location)
- ✅ Flexible dynamic field system for any item type
- ✅ Dual-detail system (public + hidden) for security
- ✅ Comprehensive email notification system
- ✅ Real-time status updates across all workflows
- ✅ Image upload support via Cloudinary
- ✅ Modern, responsive UI with Tailwind CSS

The system streamlines the entire lost & found process from item discovery to rightful owner reunion, reducing manual effort and improving accuracy through AI-assisted matching.
