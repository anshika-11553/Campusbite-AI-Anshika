# CampusBite Backend Service

Production-ready backend API service for **CampusBite**, a smart campus food ordering and queue management platform built for hackathons and high-concurrency environments using Node.js, Express, ES Modules, and Supabase.

---

## 🚀 Project Overview

CampusBite streamlines campus dining by automating daily order token generation, queue tracking, prep-time estimation, role-based order management (Student, Vendor, Chef, Admin), real-time sales metrics, and Razorpay payment integration.

---

## 🏗 Architecture

The backend adheres strictly to a clean, decoupled **Repository → Service → Controller → Route** architecture:

- **Routes (`src/routes/`)**: Map HTTP endpoints, apply authentication and RBAC middleware.
- **Controllers (`src/controllers/`)**: Thin request/response handlers returning standard JSON formats.
- **Services (`src/services/`)**: Business logic, state transitions, validation, and analytics calculations.
- **Repositories (`src/repositories/`)**: Database queries interacting exclusively with Supabase PostgREST clients.
- **Config & Constants (`src/config/`, `src/constants/`)**: Environment configurations and RBAC constant definitions.

---

## 📁 Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── razorpay.js
│   │   └── supabase.js
│   ├── constants/
│   │   └── roles.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── menu.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   └── vendor.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── repositories/
│   │   ├── auth.repository.js
│   │   ├── menu.repository.js
│   │   ├── order.repository.js
│   │   └── user.repository.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── menu.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   └── vendor.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── menu.service.js
│   │   └── order.service.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 Role Permissions Matrix

| Endpoint | Method | STUDENT | VENDOR | CHEF | ADMIN |
|---|---|:---:|:---:|:---:|:---:|
| `/api/auth/register` | `POST` | Public | Public | Public | Public |
| `/api/auth/login` | `POST` | Public | Public | Public | Public |
| `/api/menu` | `GET` | ✅ | ✅ | ✅ | ✅ |
| `/api/menu/search` | `GET` | ✅ | ✅ | ✅ | ✅ |
| `/api/orders` | `POST` | ✅ | ❌ | ❌ | ✅ |
| `/api/orders` | `GET` | ✅ | ❌ | ❌ | ✅ |
| `/api/orders/:id` | `GET` | ✅ (Own) | ❌ | ❌ | ✅ |
| `/api/payment/create-order` | `POST` | ✅ | ❌ | ❌ | ✅ |
| `/api/payment/verify` | `POST` | ✅ | ❌ | ❌ | ✅ |
| `/api/orders/:id/status` | `PATCH` | ❌ | ✅ | ✅ (No Cancel) | ✅ |
| `/api/vendor/orders` | `GET` | ❌ | ✅ | ✅ | ✅ |
| `/api/vendor/queue` | `GET` | ❌ | ✅ | ✅ | ✅ |
| `/api/vendor/dashboard` | `GET` | ❌ | ✅ | ❌ | ✅ |
| `/api/vendor/popular-items` | `GET` | ❌ | ✅ | ❌ | ✅ |
| `/api/vendor/analytics` | `GET` | ❌ | ✅ | ❌ | ✅ |

---

## 📡 API Endpoint Reference

### 1. Authentication
- `POST /api/auth/register`: Register new user account.
- `POST /api/auth/login`: Authenticate and receive JWT access token.

### 2. Menu APIs
- `GET /api/menu`: Fetch available menu items (Supports `?category=Rolls`).
- `GET /api/menu/search?q=paneer`: Search menu items by name or category.

### 3. Order Management
- `POST /api/orders`: Place new food order & generate daily queue token.
- `GET /api/orders`: Get order history for logged-in student.
- `GET /api/orders/:id`: Get order details with item breakdown.
- `PATCH /api/orders/:id/status`: Transition order status (`PAID` → `ACCEPTED` → `PREPARING` → `READY` → `COMPLETED`).

### 4. Razorpay Payments
- `POST /api/payment/create-order`: Create Razorpay order for pending order.
- `POST /api/payment/verify`: Verify HMAC SHA-256 signature and set status to `PAID`.

### 5. Vendor & Kitchen Operations
- `GET /api/vendor/orders`: View active incoming vendor orders.
- `GET /api/vendor/queue`: View live token queue ordered by token number.
- `GET /api/vendor/dashboard`: Get real-time dashboard order breakdown and today's revenue.
- `GET /api/vendor/popular-items`: Fetch most ordered items sorted by quantity.
- `GET /api/vendor/analytics`: Comprehensive metrics (revenue, wait time, prep time, peak hour, popular item).

---

## ⚙️ Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in credentials:
   ```bash
   cp .env.example .env
   ```
   Required `.env` variables:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

3. **Running the Server**:
   - Development Mode: `npm run dev`
   - Production Mode: `npm start`
