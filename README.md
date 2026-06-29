#   Aptagiri Royal Caterers & Bakers: Cake Shop Management System

  Aptagiri Royal Caterers & Bakers is a comprehensive, production-ready e-commerce and administrative management system tailored for cake shops and artisanal bakeries. It is built using **React (TypeScript)** on the frontend, **NestJS** on the backend, and **PostgreSQL** as the relational database managed with **TypeORM**.

---

## 🚀 Key Features
1. **Catalog Browsing & Filtration**: Search catalog entries and filter cakes dynamically by flavor.
2. **Global Session & Cart States**: Context-driven shopping cart with automatic price, delivery fee, and free shipping boundary calculations.
3. **Secure Checkout Flow**: Integrates transaction operations that run SQL-level row locking (`pessimistic_write`) to prevent double-depletion race conditions.
4. **Mock Payment Settlement**: Interfaces with a mock card gateway to settle order transaction IDs.
5. **Auto-Restock on Cancellation**: Re-increments cake inventory in the database if an order status is updated to `Cancelled` by an administrator.
6. **Auto-Seeding Catalog**: Generates a default catalog of 5 starter cakes automatically on backend module initialization if the table is empty.
7. **Adaptive Role-Based Auth**: Utilizes JWT authentication. Registers administrators automatically if the user's email contains the word `"admin"`.
8. **Admin Operations Board**: Admin console panel providing full CRUD operations for cakes via validation modals, order delivery dispatch queues, and sales stats dashboard.
9. **Sales Aggregation Charts**: Generates analytics reporting charts showing top products by revenue and quantities using Recharts.

---

## 📁 Workspace Layout
```
/Cake
  ├── backend/               # NestJS Core Backend API
  ├── frontend/              # Vite + React Frontend Client
  └── README.md              # Project Documentation
```

---

## 🛠️ Local Installation & Setup

### Prerequisites
- **Node.js**: v18 or newer (tested on v24)
- **npm**: v9 or newer
- **PostgreSQL**: Local service listening on default port `5432`

---

### Step 1: Create Database
The system requires a database named `cake_shop`. We provide a programmatic utility to initialize this automatically.

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Run the database creation script:
   ```bash
   # If your local postgres user has a password other than 'postgres', set it first:
   # PowerShell:
   $env:DB_PASSWORD="your_postgres_password"
   node create-db.js
   
   # Git Bash / Linux:
   DB_PASSWORD="your_postgres_password" node create-db.js
   ```
3. This will connect to your default Postgres database and run `CREATE DATABASE cake_shop;` if it does not already exist.

---

### Step 2: Configure Environment Variables
Inside the `backend/` folder, check the generated [`.env`](file:///c:/Users/avina/OneDrive/Desktop/Cake/backend/.env) file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_actual_password   # Update this to match your PostgreSQL password
DB_DATABASE=cake_shop
JWT_SECRET=super_secret_cake_key_12345
JWT_EXPIRES_IN=1d
PORT=3000
```
Update `DB_PASSWORD` if your database user uses a different password.

---

### Step 3: Start the Backend (NestJS)
1. Inside the `backend/` folder, run:
   ```bash
   npm run start:dev
   ```
2. The server will boot on `http://localhost:3000`. On start, it checks if the database is empty and automatically inserts 5 seed cakes.

---

### Step 4: Start the Frontend (React + Vite)
1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 📑 Resume-Ready Project Description (ATS-Friendly)

Add this entry to your resume under **Experience** or **Projects**:

> **Full-Stack Software Engineer — Cake Shop Management System (React, NestJS, PostgreSQL)**
> - Developed a full-stack e-commerce and inventory console utilizing React (Vite/TypeScript) and NestJS, managing persistent database schemas with PostgreSQL and TypeORM.
> - Engineered a secure, database-transaction checkout module using pessimistic locking (`pessimistic_write`) to preserve inventory consistency and prevent stock double-depletion race conditions under concurrent client requests.
> - Implemented role-based route protection guards (Customer vs. Admin) and custom JWT strategies to handle secure sessions, storing credentials using bcrypt-hashed password tokens.
> - Designed and styled a premium, responsive frontend client using custom CSS variables (rose/cream tones), modal dialogs, and loading skeletons, delivering an adaptive experience across all viewports.
> - Integrated Recharts reporting dashboards for administrative teams, aggregating product quantities sold and revenues through SQL grouping queries.
> - Authored automated restock logic triggered upon order cancellation, returning items back to inventory to ensure catalog tracking accuracy.
