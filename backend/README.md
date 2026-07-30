# CampusBite Backend

Scaffolded backend service for CampusBite built with Node.js, Express, and ES Modules.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and configure your environment variables.
   ```bash
   cp .env.example .env
   ```

3. **Running the Server**:
   - Development: `npm run dev`
   - Production: `npm start`

## Directory Structure

```
backend/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── helpers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validations/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
