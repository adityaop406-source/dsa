import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Problem = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  hint: string;
  explanation: string;
  time_complexity: string;
  space_complexity: string;
  sample_input: string;
  sample_output: string;
  starter_code: string;
  created_at: string;
};

export type Progress = {
  id: string;
  user_id: string;
  problem_id: string;
  solved: boolean;
  solved_at: string | null;
  created_at: string;
};
