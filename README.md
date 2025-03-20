# Pertiv (Perpustakaan kreativ)🚀

Pertiv is a web application that allows users to borrow and buy books. this is my final project at Bootcamp Geeksfarm Batch 13.

## 🛠️Tech Stack

**Frontend:**

- Next JS 14
- Tailwind CSS
- Shadcn
- React hook form
- Zod
- Jose

**Backend:**

- Node JS & Express JS
- Prisma ORM
- Multer
- Express validator
- Cors
- Dotenv
- Swagger
- Winston logger
- JSON web token
- Nodemon

## 📦 Getting Started

### Prerequisites

- Node.js (v22)
- npm

### Installation

1. **Clone the repository**

```bash
Clone using HTTPS

git clone https://github.com/devden7/Pertiv.git
cd pertiv
```

2. **Configure Environment Variables**
   Copy paste from `.env.example` and set up your `.env` file with the required environment variables

- Backend :

```bash
cd pertiv-backend
```

`PORT_LISTEN= # YOUR BACKEND PORT`

`ORIGIN_URL="" # YOUR FRONTEND URL`

`DATABASE_URL="" # YOUR DATABASE URL  : postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME`

`EMAIL_ADMIN="" # SET YOUR EMAIL FOR ADMIN`

`PASSWORD_ADMIN="" # SET YOUR PASSWORD FOR ADMIN`

`JWT_SECRET="" # SET YOUR JWT SECRET KEY`

- Frontend :

```bash
cd pertiv-frontend
```

`NEXT_PUBLIC_API_URL= # YOUR BACKEND URL`

`JWT_SECRET= # SET YOUR JWT SECRET KEY (SHOULD BE THE SAME WITH THE JWT KEY IN BACKEND)`

3. **Install Dependencies**

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

4. **Start seed for creating `Admin` account**

```bash
npm run seedAdmin
```

5. **Running the application**

- Backend

```bash
npm start
```

- Frontend

```bash
npm run dev
```

## ✨ Features

### Role

**Admin**

- manage Staff account (CRUD)

**Staff**

- Manage borrow and buy books like a stock, category (CRUD)
- Manage borrow and buy books transaction
- Access Dashboard

**User**

- Borrow & buying a book

### Core Application

- Login & Register
- Borrow and buying books
- Cart for buying
- Collection for borrow
- Manage order transaction
- Dashboard
