/*
  # DSA Practice Web App Schema

  1. New Tables
    - `problems`
      - `id` (uuid, primary key)
      - `title` (text)
      - `category` (text) - strings, arrays, stack, queue, etc.
      - `difficulty` (text) - easy, medium, hard
      - `hint` (text)
      - `explanation` (text)
      - `time_complexity` (text)
      - `space_complexity` (text)
      - `sample_input` (text)
      - `sample_output` (text)
      - `starter_code` (text)
      - `created_at` (timestamptz)
    
    - `progress`
      - `id` (uuid, primary key)
      - `user_id` (text) - storing session identifier
      - `problem_id` (uuid, foreign key to problems)
      - `solved` (boolean)
      - `solved_at` (timestamptz)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to problems
    - Add policies for users to manage their own progress
*/

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
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  problem_id uuid REFERENCES problems(id) ON DELETE CASCADE,
  solved boolean DEFAULT false,
  solved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read problems"
  ON problems FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert problems"
  ON problems FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read progress"
  ON progress FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert progress"
  ON progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update progress"
  ON progress FOR UPDATE
  USING (true)
  WITH CHECK (true);

INSERT INTO problems (title, category, difficulty, hint, explanation, time_complexity, space_complexity, sample_input, sample_output, starter_code) VALUES
('Two Sum', 'arrays', 'easy', 'Use a hash map to store complements', 'Iterate through the array and for each element, check if its complement exists in the hash map. If it does, return the indices. Otherwise, add the current element to the hash map.', 'O(n)', 'O(n)', '[2, 7, 11, 15], target = 9', '[0, 1]', 'def two_sum(nums, target):
    # Your code here
    pass'),
('Valid Parentheses', 'stack', 'easy', 'Use a stack to match opening and closing brackets', 'Use a stack to keep track of opening brackets. When you encounter a closing bracket, check if it matches the most recent opening bracket on the stack.', 'O(n)', 'O(n)', '()[]{}', 'true', 'def is_valid(s):
    # Your code here
    pass'),
('Reverse Linked List', 'linkedlist', 'medium', 'Keep track of previous, current, and next nodes', 'Iterate through the list, reversing the direction of each pointer as you go.', 'O(n)', 'O(1)', '1 -> 2 -> 3 -> 4 -> 5', '5 -> 4 -> 3 -> 2 -> 1', 'def reverse_list(head):
    # Your code here
    pass'),
('Maximum Subarray', 'arrays', 'medium', 'Use Kadane''s algorithm', 'Keep track of the maximum sum ending at the current position and the global maximum.', 'O(n)', 'O(1)', '[-2,1,-3,4,-1,2,1,-5,4]', '6', 'def max_subarray(nums):
    # Your code here
    pass'),
('Merge K Sorted Lists', 'linkedlist', 'hard', 'Use a min heap to efficiently find the smallest element', 'Use a priority queue to always extract the smallest element from all lists.', 'O(n log k)', 'O(k)', '[[1,4,5],[1,3,4],[2,6]]', '[1,1,2,3,4,4,5,6]', 'def merge_k_lists(lists):
    # Your code here
    pass');
