# CampusBite AI – Frontend Application

CampusBite AI is a premium smart campus canteen pre-order and queue management platform built for **Students**, **Vendors**, **Admins**, and **Chief Admins**.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Reusable handcrafted primitives (Button, Input, Card, Badge, Alert) & Shadcn UI architecture
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Authentication**: Firebase Authentication (Provider-Independent Interface Strategy)

---

## 📁 Folder Structure

```
frontend/
├── __tests__/          # Component, Service & Utility Test Architecture
├── app/                # App Router (login, student, vendor, admin, chief, unauthorized)
├── components/         # Reusable UI primitives, Layouts, Forms, Common & Auth views
├── services/           # Provider-independent Auth & Versioned API v1 modules
├── hooks/              # Custom Hooks (useAuth, useForm, useTheme)
├── context/            # Global React Contexts (AuthContext, ThemeContext)
├── lib/                # Firebase SDK & utility helpers
├── config/             # Site & Theme configuration
├── constants/          # Roles, Routes, API endpoints, Colors, Currency (₹)
├── types/              # TypeScript Type Contracts & Interfaces
├── utils/              # Validators (RFC-5322), Sanitizers, Logger
├── public/             # Branding assets & SVG illustrations
└── middleware.ts       # Edge Route Protection & Role Guard
```

---

## ⚙️ Environment Setup

Copy `.env.example` to `.env.local` inside `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🛠️ Available Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Lint code
npm run lint

# Run strict TypeScript verification
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 🔐 Quality Gate Pipeline

Before committing and pushing code to `feature/frontend-phase1`:

```bash
npm run lint && npx tsc --noEmit && npm run build
```

---

## 📜 Phase Roadmap

- [x] **Phase 1**: Project Setup, Provider-Independent Auth Architecture, Design System, Versioned API v1 Contracts, Login Interface, Route Protection.
- [ ] **Phase 2**: Student Dashboard, Meal Pre-ordering, Cart & Checkout, QR Pickup Generation.
- [ ] **Phase 3**: Vendor Dashboard & Real-Time Kitchen Order Queue Management.
- [ ] **Phase 4**: Admin Operations & Staff Portal.
- [ ] **Phase 5**: Chief Executive Analytics & System-wide Supervision.
