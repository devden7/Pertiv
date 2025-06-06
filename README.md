# 📚 Pertiv - Inventory & Sales Book Management System

**Pertiv** is a web-based application for managing book inventory, sales, and borrowing systems. It supports user memberships, logging, and includes different roles: **Admin**, **Staff**, and **User**.

## 🧱 Tech Stack

### 🖥️ Frontend

- **Next.js 14**
- **Tailwind CSS**
- **Shadcn UI**
- **React Hook Form**
- **Zod**
- **Jose**

### ⚙️ Backend

- **Node.js + Express.js**
- **Prisma ORM**
- **Multer**
- **Express Validator**
- **CORS**
- **Dotenv**
- **Swagger**
- **Winston Logger**
- **JSON Web Token (JWT)**

## 👥 Role & Feature Breakdown

### 🔐 Admin

- ✅ Manage Staff accounts (CRUD)
- 📊 Monitor system activity logs

### 🧑‍💻 Staff

- 📚 Manage book data (CRUD)
- 📦 Manage stock & categories
- 💼 Manage borrow and purchase transactions
- 👥 Manage package memberships
- 📈 Access system performance dashboard

### 🙋‍♂️ User

- 📖 Borrow and return books
- 🚩 Penalty applies for late returns
- 🛒 Purchase books
- 🧾 Join membership program

## 📂 Project Structure

### 📁 `backend/` — Express.js Application

#### 🔧 Configuration & Utilities

- `config/env.js` — environment configuration
- `middleware/` — role-based authorization & error handling
- `lib/prisma/` — database schema, migrations & seed
- `lib/winston/` — logging configuration
- `lib/multer/` — file upload setup

#### 📦 Features & Controllers

- **Admin**
  - `log.controller.js` — activity logs
  - `user.controller.js` — manage staff
- **Auth**
  - `auth.controller.js` — authentication flow
- **Staff**
  - `books.controller.js` — manage books
  - `dashboard.controller.js` — dashboard insights
  - `order.controller.js` — manage transactions
  - `membership.controller.js` — manage memberships package
- **User**
  - `books.controller.js` — explore books
  - `cart.controller.js` — shopping cart
  - `membership.controller.js` — membership features
  - `order.controller.js` — order transaction

#### 🛣️ Routing

- `admin.route.js`
- `auth.route.js`
- `staff.route.js`
- `user.route.js`

#### 💡 Others

- `repositories/` — DB access layer
- `services/` — business logic
- `utils/` — utility functions

---

### 📁 `frontend/` — Next.js 14 Application

- `app/` — App Router pages
- `components/` — reusable UI components
- `hooks/` — custom React hooks
- `lib/` — API clients and shared libraries
- `model/` — type definitions and interfaces
- `public/` — static assets
- `utils/` — helpers and utilities
- `middleware.ts` — frontend route protection

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js `v22+`
- npm

### 1️⃣ Clone Repository

```bash
git clone https://github.com/devden7/Pertiv.git
cd Pertiv
```

### 2️⃣ Configure Environment Variables

🔙 Backend

```bash
cd pertiv-backend
cp .env.example .env
```

Edit .env:

```env
PORT_LISTEN=5000
ORIGIN_URL=http://localhost:3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/pertivdb
EMAIL_ADMIN=admin@email.com
PASSWORD_ADMIN=admin123
JWT_SECRET=your_jwt_secret
```

🖥️ Frontend

```bash
cd pertiv-frontend
cp .env.example .env
```

Edit .env:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret
```

### 3️⃣ Install Dependencies

- Backend

```bash
cd pertiv-backend
npm install
```

- Frontend

```bash
cd pertiv-frontend
npm install
```

### 4️⃣ Seed Admin Account

```bash
cd pertiv-backend
npm run seedAdmin
```

### 5️⃣ Run the Application

- Backend

```bash
npm start
```

- Frontend

```bash
npm run dev
```

## 📄 API Documentation

This project includes a built-in Swagger documentation interface for API testing.

### 🔗 Access via:

```text
http://localhost:5000/api-docs
```

Features:

- All available endpoints
- Sample input/output
