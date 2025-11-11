# DSA Practice Web App

A comprehensive Data Structures and Algorithms practice platform with 300 curated coding problems across multiple categories and difficulty levels.

## Features

- **300 DSA Problems**: 100 Easy, 100 Medium, and 100 Hard problems
- **10 Categories**: Strings, Arrays, Linked Lists, Trees, Dynamic Programming, Backtracking, Graphs, Heaps, Stacks/Queues, and more
- **In-Browser Code Editor**: Monaco Editor with syntax highlighting
- **Code Execution**: Run Python code directly in browser using Pyodide
- **Progress Tracking**: Track solved problems and view statistics
- **Admin Dashboard**: Add custom problems via admin interface
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and builds
- **TailwindCSS** for styling
- **Monaco Editor** for code editing
- **Pyodide** for in-browser Python execution
- **React Router** for navigation
- **Supabase Client** for database access

### Backend
- **Node.js** with Express
- **Supabase** for database and authentication
- **JWT** for admin authentication
- **Express Rate Limiter** for API protection
- **CORS** for cross-origin requests

### Database
- **Supabase (PostgreSQL)** with Row Level Security
- **Tables**: problems, progress
- **Real-time** capabilities for live updates

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (database already configured)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**

   Frontend:
   ```bash
   npm install
   ```

   Backend:
   ```bash
   cd backend
   npm install
   ```

### Database Setup

The Supabase database is already configured with the required schema. To seed the database with 300 problems:

```bash
npm run seed
```

This will populate the `problems` table with all DSA problems.

### Running the Application

#### Development Mode

1. **Start the backend server** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on `http://localhost:4000`

2. **Start the frontend dev server** (Terminal 2):
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Open your browser** to `http://localhost:5173`

#### Production Build

```bash
npm run build
```

### Admin Access

- **Username**: `admin`
- **Password**: `Admin@1234`

Use admin credentials to access the admin dashboard and add custom problems.

## Project Structure

```
project/
├── src/                      # Frontend source code
│   ├── components/           # React components
│   │   ├── Dashboard.tsx     # Main problem list
│   │   ├── CodeEditor.tsx    # Monaco code editor
│   │   ├── AddProblemModal.tsx # Admin modal
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   └── ProgressBar.tsx   # Progress visualization
│   ├── pages/                # Page components
│   │   ├── Home.tsx          # Landing page
│   │   └── ProblemPage.tsx   # Problem solving interface
│   ├── services/             # API services
│   │   └── api.ts            # Backend API calls
│   ├── lib/                  # Utilities
│   │   └── supabase.ts       # Supabase client
│   └── App.tsx               # Main app component
├── backend/                  # Backend source code
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── config/           # Configuration files
│   │   └── server.js         # Express server
│   └── package.json
├── scripts/
│   └── seedDatabase.js       # Database seeding script
├── problems_seed.json        # 300 problems dataset
└── README.md
```

## API Endpoints

### Problems

- `GET /api/problems` - Get all problems (with filters)
  - Query params: `category`, `difficulty`
- `GET /api/problems/:id` - Get single problem
- `POST /api/problems` - Create problem (admin only)

### Progress

- `GET /api/progress/:userId` - Get user progress
- `POST /api/progress` - Mark problem as solved

### Admin

- `POST /api/admin/login` - Admin login

## Environment Variables

### Frontend (`.env`)
```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### Backend (`backend/.env`)
```env
PORT=4000
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
JWT_SECRET=<your-jwt-secret>
ADMIN_USER=admin
ADMIN_PASS=Admin@1234
NODE_ENV=development
```

## Deployment

### Frontend (Vercel)

1. **Connect repository to Vercel**
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `/`
3. **Add environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Deploy**

### Backend (Render / Railway)

1. **Connect repository**
2. **Configure settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
3. **Add environment variables**:
   - `PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.
4. **Deploy**

### Database (Supabase)

Database is already configured and hosted on Supabase. No additional deployment needed.

**After deployment**:
- Update `VITE_API_BASE_URL` in frontend to point to deployed backend
- Run seed script on deployed backend to populate database

## Problem Categories

1. **Strings** (40 problems)
2. **Arrays** (50 problems)
3. **Linked Lists** (20 problems)
4. **Trees** (50 problems)
5. **Dynamic Programming** (30 problems)
6. **Backtracking** (15 problems)
7. **Graphs** (25 problems)
8. **Heaps** (10 problems)
9. **Stacks & Queues** (15 problems)
10. **Binary Search** (20 problems)
11. **Math & Bit Manipulation** (25 problems)

## Scripts

- `npm run dev` - Start frontend dev server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run seed` - Seed database with problems
- `npm run lint` - Run ESLint

Backend scripts (in `backend/`):
- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend in production

## Features in Detail

### Code Execution
- Uses Pyodide to run Python code in the browser
- No server-side execution needed
- Safe sandboxed environment
- Real-time output and error messages

### Progress Tracking
- Tracks which problems each user has solved
- Shows completion percentage by category
- Visual progress indicators
- Persistent across sessions

### Admin Features
- Secure JWT-based authentication
- Add new problems via modal interface
- All fields validated before submission
- Problems immediately available after creation

## Database Schema

### Problems Table
```sql
CREATE TABLE problems (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  hint TEXT,
  explanation TEXT,
  time_complexity TEXT,
  space_complexity TEXT,
  sample_input TEXT,
  sample_output TEXT,
  starter_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Progress Table
```sql
CREATE TABLE progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  problem_id BIGINT REFERENCES problems(id),
  solved_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
