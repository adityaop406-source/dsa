# DSA Practice Web App - Backend API

A robust REST API for managing Data Structures and Algorithms practice problems with progress tracking.

## Tech Stack

- **Node.js** + **Express** - Server framework
- **Supabase (PostgreSQL)** - Database
- **JWT** - Authentication
- **Docker** - Containerization

## Features

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Admin login

#### Problems
- `GET /api/problems` - Get all problems (with filtering & pagination)
- `GET /api/problems/:id` - Get single problem
- `POST /api/problems` - Create problem (admin only)
- `PUT /api/problems/:id` - Update problem (admin only)
- `DELETE /api/problems/:id` - Delete problem (admin only)

#### Progress Tracking
- `POST /api/progress` - Mark problem as solved
- `GET /api/progress` - Get user progress
- `DELETE /api/progress` - Remove progress entry

### Query Parameters

**GET /api/problems**
- `category` - Filter by category (Array, String, Tree, etc.)
- `difficulty` - Filter by difficulty (Easy, Medium, Hard)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**GET /api/progress**
- `userId` - User ID (required)
- `category` - Filter by category
- `difficulty` - Filter by difficulty

## Data Models

### Problem
```javascript
{
  id: uuid,
  title: string,
  category: string,
  difficulty: string,
  hint: string,
  explanation: string,
  time_complexity: string,
  space_complexity: string,
  sample_input: string,
  sample_output: string,
  starter_code: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Progress
```javascript
{
  id: uuid,
  user_id: string,
  problem_id: uuid,
  solved_at: timestamp,
  created_at: timestamp
}
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account and project

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=4000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=ChangeMe
ADMIN_USER=admin
ADMIN_PASS=Admin@1234
NODE_ENV=development
```

### Local Development

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Seed the database:**
```bash
npm run seed
```

3. **Start the development server:**
```bash
npm run dev
```

The server will start on `http://localhost:4000`

### Docker Setup

1. **Build and run with Docker Compose:**
```bash
docker-compose up --build
```

2. **Stop the containers:**
```bash
docker-compose down
```

## Admin Credentials (Development Only)

**Username:** `admin`
**Password:** `Admin@1234`

**Important:** Change these credentials in production!

## Authentication

### Login

**Request:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin@1234"}'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

### Using the Token

Include the token in the Authorization header for admin-only endpoints:

```bash
curl -X POST http://localhost:4000/api/problems \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Binary Search",
    "category": "Array",
    "difficulty": "Easy"
  }'
```

## API Examples

### Get All Problems
```bash
curl http://localhost:4000/api/problems?category=Array&difficulty=Easy&page=1&limit=10
```

### Get Single Problem
```bash
curl http://localhost:4000/api/problems/{problem-id}
```

### Mark Problem as Solved
```bash
curl -X POST http://localhost:4000/api/progress \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "problemId": "problem-uuid"
  }'
```

### Get User Progress
```bash
curl http://localhost:4000/api/progress?userId=user123&category=Array
```

## Security Features

- **CORS** enabled for cross-origin requests
- **Rate limiting** to prevent abuse
- **Input validation** using express-validator
- **JWT authentication** for admin routes
- **Row Level Security (RLS)** in Supabase

## Database Management

The database schema is managed through Supabase migrations and includes:
- Two main tables: `problems` and `progress`
- Indexes for optimized queries
- RLS policies for data security
- Automatic timestamp updates

## Progress Logic

The progress tracking is **idempotent** - marking the same problem as solved multiple times won't create duplicates. The unique constraint on `(user_id, problem_id)` ensures this behavior.

## Health Check

```bash
curl http://localhost:4000/health
```

Response:
```json
{
  "status": "ok",
  "message": "DSA Practice API is running"
}
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed database with sample problems

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## License

MIT
