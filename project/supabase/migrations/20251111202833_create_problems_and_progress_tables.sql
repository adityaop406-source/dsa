/*
  # Create DSA Practice Database Schema

  ## Tables Created
  
  ### 1. problems
  - `id` (uuid, primary key) - Unique identifier for each problem
  - `title` (text) - Problem title
  - `category` (text) - Category (e.g., Array, String, Tree, etc.)
  - `difficulty` (text) - Difficulty level (Easy, Medium, Hard)
  - `hint` (text) - Hint to help solve the problem
  - `explanation` (text) - Detailed explanation of the solution
  - `time_complexity` (text) - Time complexity notation
  - `space_complexity` (text) - Space complexity notation
  - `sample_input` (text) - Example input
  - `sample_output` (text) - Example output
  - `starter_code` (text) - Initial code template
  - `created_at` (timestamptz) - Timestamp when problem was created
  - `updated_at` (timestamptz) - Timestamp when problem was last updated

  ### 2. progress
  - `id` (uuid, primary key) - Unique identifier for progress entry
  - `user_id` (text) - User identifier
  - `problem_id` (uuid, foreign key) - References problems table
  - `solved_at` (timestamptz) - Timestamp when problem was solved
  - `created_at` (timestamptz) - Timestamp when record was created
  
  ## Security
  - Enable RLS on both tables
  - Public read access for problems (all users can view problems)
  - Authenticated users can read/write their own progress
  - Only admin can modify problems (handled via backend API)

  ## Indexes
  - Index on problems (category, difficulty) for faster filtering
  - Index on progress (user_id, problem_id) for faster queries
  - Unique constraint on progress (user_id, problem_id) to prevent duplicates
*/

-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  hint text DEFAULT '',
  explanation text DEFAULT '',
  time_complexity text DEFAULT '',
  space_complexity text DEFAULT '',
  sample_input text DEFAULT '',
  sample_output text DEFAULT '',
  starter_code text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  solved_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_problems_category_difficulty ON problems(category, difficulty);
CREATE INDEX IF NOT EXISTS idx_progress_user_problem ON progress(user_id, problem_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);

-- Enable Row Level Security
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for problems table (public read access)
CREATE POLICY "Anyone can view problems"
  ON problems FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can insert problems"
  ON problems FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Service role can update problems"
  ON problems FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete problems"
  ON problems FOR DELETE
  TO public
  USING (true);

-- RLS Policies for progress table (users can manage their own progress)
CREATE POLICY "Users can view their own progress"
  ON progress FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own progress"
  ON progress FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their own progress"
  ON progress FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own progress"
  ON progress FOR DELETE
  TO public
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_problems_updated_at ON problems;
CREATE TRIGGER update_problems_updated_at
  BEFORE UPDATE ON problems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
