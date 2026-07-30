# CampusBite AI – OpenAPI 3.0 / Swagger Ready API Specification

This document details the RESTful API endpoints, request payload DTOs, and response schemas required by the CampusBite AI frontend.

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### POST `/api/v1/auth/login`
- **Description**: Authenticates campus users (Student, Vendor, Head Chef, Admin).
- **Request Body (`AuthLoginDto`)**:
  ```json
  {
    "email": "student@college.edu",
    "password": "••••••••",
    "role": "student"
  }
  ```
- **Response (`ApiResponseDto<AuthUser>`)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "uid": "usr-101",
      "email": "student@college.edu",
      "displayName": "Anshika Sharma",
      "role": "student"
    }
  }
  ```

### POST `/api/v1/auth/register`
- **Description**: Registers a new campus student or staff account.
- **Request Body (`AuthRegisterDto`)**:
  ```json
  {
    "fullName": "Anshika Sharma",
    "email": "student@college.edu",
    "mobile": "9876543210",
    "studentOrStaffId": "STD-2026-89",
    "department": "Computer Science",
    "role": "student"
  }
  ```

### POST `/api/v1/auth/forgot-password`
- **Description**: Sends password reset instructions.

---

## 2. Menu Catalogue Endpoints (`/api/v1/menu`)

### GET `/api/v1/menu`
- **Description**: Fetches the 35+ item food catalogue with nutritional info, prep times, and image URLs.

### GET `/api/v1/menu/categories`
- **Description**: Returns all active food categories (Breakfast, Main Course, Fast Food, Snacks, Beverages, Desserts).

---

## 3. Order Workflow Endpoints (`/api/v1/orders`)

### POST `/api/v1/orders`
- **Description**: Places a new pre-order and generates a unique two-digit token (01–99).
- **Request Body (`CreateOrderDto`)**:
  ```json
  {
    "studentId": "std-user-1",
    "studentName": "Anshika Sharma",
    "vendorName": "Main Campus Food Court",
    "items": [
      { "itemId": "item-1", "itemName": "Paneer Butter Masala Combo", "quantity": 1, "priceInINR": 140 }
    ],
    "totalAmountInINR": 140,
    "pickupSlot": "Instant Pickup (10-15 mins)",
    "paymentMethod": "UPI"
  }
  ```

### PATCH `/api/v1/orders/:id/status`
- **Description**: Updates order status (`ACCEPTED`, `SENT_TO_KITCHEN`, `PREPARING`, `READY`, `COLLECTED`, `CANCELLED`).

---

## 4. Vendor & Head Chef Endpoints (`/api/v1/vendor`, `/api/v1/chief`)

### GET `/api/v1/vendor/analytics`
- **Description**: Returns gross revenue, top selling items, and hourly throughput metrics.

### GET `/api/v1/chief/queue`
- **Description**: Retrieves real-time Kitchen Display System (KDS) prep tickets.
