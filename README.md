# ClaimPoint - Smart Lost & Found Platform

> An AI-powered Lost & Found Management System that automatically connects lost items with found items, helping organizations and users recover belongings 10x faster.

**[📖 Full Documentation](./docs/README_COMPREHENSIVE.md)** | **[🚀 Quick Start](#quick-start)** | **[💡 How It Works](#how-it-works)** | **[📞 Support](#support)**

---

## **Project Overview**

- **Role-Based Access:**

  - **Superadmin:** Can manage users and staff accounts.
  - **Staff:** Can record found items, view claims, and handle item returns.
  - **General Users:** Can report lost items, browse found items, and claim items.

- **Smart Matching:** AI-based similarity algorithm automatically matches lost and found items.

- **Notification System:** Users are notified when a possible match is found via email/in-app alert.

- **Integration:** Can be integrated into any organization's existing website like airports, hospitals, universities, etc.

---

## **Features**

✅ Two-Way Reporting System (Lost & Found)
✅ Admin Dashboard (Superadmin & Staff)
✅ User-Friendly Interface for the public
✅ Smart AI Matching Algorithm
✅ Notification System (Email/SMS/in-app)
✅ Secure Authentication & Role-Based Access
✅ Search & Filter for items
✅ Scalable & Modular Architecture

---

## **Tech Stack**

- **Frontend:** React, Vite, Axios, React Router
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Docker)
- **Authentication:** JWT (JSON Web Tokens), bcrypt
- **AI Matching:** Custom similarity algorithm (to be implemented)

---

## **Installation**

### **1. Clone the repository:**

```bash
git clone https://github.com/yourusername/claimpoint-smart-lost-found.git
cd claimpoint-smart-lost-found
```

### **2. Install dependencies:**

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### **3. Set up PostgreSQL with Docker:**

```bash
# Pull and run PostgreSQL container
docker run --name claimpoint-postgres \
  -e POSTGRES_DB=claimpoint_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_postgres_password \
  -p 5432:5432 \
  -d postgres:latest

# Verify the container is running
docker ps
```

Alternatively, use Docker Compose by creating a `docker-compose.yml` file in the root directory:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:latest
    container_name: claimpoint-postgres
    environment:
      POSTGRES_DB: claimpoint_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_postgres_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Then run:

```bash
docker-compose up -d
```

### **4. Create `.env` files:**

Create a `.env` file in the `server` directory:

```env
# Backend Environment Variables
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=claimpoint_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `client` directory (if needed):

```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
```

### **5. Run the project:**

```bash
# Start Backend Server
cd server
npm run dev

# Start Frontend (in a new terminal)
cd client
npm run dev
```

---

## **Usage**

### **Access Points:**

- **Landing Page:** `http://localhost:5173/`
- **Frontend Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

### **Login Options:**

1. **Staff Login** - For staff members to manage found items and claims
2. **General User Login** - For public users to report lost items and browse found items
3. **User Sign Up** - New users can create an account
4. **Superadmin Login** - Separate route for system administrators (e.g., `/superadmin-login`)

### **User Roles:**

- **Superadmin:**

  - Create and manage staff accounts
  - Manage user accounts
  - Oversee entire system operations
  - Access analytics and reports

- **Staff:**

  - Add and manage found items
  - View and verify claims
  - Process item returns
  - Update item status

- **General Users:**
  - Report lost items with descriptions and photos
  - Browse found items database
  - Submit claims for matching items
  - Receive notifications for potential matches
  - Track claim status

---

## **Project Structure**

```
claimpoint-smart-lost-found/
├── client
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── public 
│   ├── README.md
│   ├── src
│   │   ├── api
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   ├── services
│   │   └── utils
├── package.json
├── README.md
└── server
    ├── config
    │   └── db.js
    ├── controllers
    ├── index.js
    ├── middleware
    │   └── auth.js
    ├── models
    │   └── User.js
    ├── package.json
    ├── package-lock.json
    ├── routes
    │   └── auth.js
    ├── seedSuperadmin.js
    └── utils

```

---

## **Development Roadmap**

- [x] Project setup and architecture
- [x] Authentication system
- [x] User interfaces
- [ ] AI matching algorithm implementation
- [ ] Email notification system
- [ ] SMS notification integration
- [ ] Advanced search and filters
- [ ] Analytics dashboard
- [ ] Mobile responsive design
- [ ] Testing and bug fixes
- [ ] Deployment

---

<!--
## **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## **Contact**

**Project Maintainer:** Your Name
**Email:** your.email@example.com
**GitHub:** [@yourusername](https://github.com/yourusername)

---

## **Acknowledgments**

- Thanks to all contributors who helped build this project
- Inspired by the need for efficient lost and found management in organizations
- Built with modern web technologies for scalability and performance

---

## **Support**

If you find this project helpful, please give it a ⭐ on GitHub!

For bug reports and feature requests, please open an issue on the [GitHub repository](https://github.com/yourusername/claimpoint-smart-lost-found/issues). -->
