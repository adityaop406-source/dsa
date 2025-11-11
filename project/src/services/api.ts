import { supabase, Problem, Progress } from '../lib/supabase';

const USER_ID = 'guest-user';

export const api = {
  async getProblems(filters?: { difficulty?: string; category?: string }): Promise<Problem[]> {
    let query = supabase.from('problems').select('*').order('created_at', { ascending: true });

    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getProblem(id: string): Promise<Problem | null> {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createProblem(problem: Omit<Problem, 'id' | 'created_at'>): Promise<Problem> {
    const { data, error } = await supabase
      .from('problems')
      .insert([problem])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markAsSolved(problemId: string): Promise<void> {
    const { data: existing } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', USER_ID)
      .eq('problem_id', problemId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('progress')
        .update({ solved: true, solved_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('progress')
        .insert([
          {
            user_id: USER_ID,
            problem_id: problemId,
            solved: true,
            solved_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
    }
  },

  async getProgress(): Promise<Progress[]> {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', USER_ID);

    if (error) throw error;
    return data || [];
  },
};
