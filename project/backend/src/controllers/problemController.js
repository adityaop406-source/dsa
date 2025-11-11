import { supabase } from '../config/supabase.js';

export const getProblems = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('problems')
      .select('*', { count: 'exact' });

    if (category) {
      query = query.eq('category', category);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + parseInt(limit) - 1);

    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching problems:', error);
      return res.status(500).json({ error: 'Failed to fetch problems' });
    }

    res.json({
      problems: data,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error in getProblems:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching problem:', error);
      return res.status(500).json({ error: 'Failed to fetch problem' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in getProblemById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      category,
      difficulty,
      hint = '',
      explanation = '',
      time_complexity = '',
      space_complexity = '',
      sample_input = '',
      sample_output = '',
      starter_code = ''
    } = req.body;

    const { data, error } = await supabase
      .from('problems')
      .insert([{
        title,
        category,
        difficulty,
        hint,
        explanation,
        time_complexity,
        space_complexity,
        sample_input,
        sample_output,
        starter_code
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating problem:', error);
      return res.status(500).json({ error: 'Failed to create problem' });
    }

    res.status(201).json({ message: 'Problem created successfully', problem: data });
  } catch (error) {
    console.error('Error in createProblem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: existingProblem, error: fetchError } = await supabase
      .from('problems')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking problem:', fetchError);
      return res.status(500).json({ error: 'Failed to check problem' });
    }

    if (!existingProblem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const { data, error } = await supabase
      .from('problems')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating problem:', error);
      return res.status(500).json({ error: 'Failed to update problem' });
    }

    res.json({ message: 'Problem updated successfully', problem: data });
  } catch (error) {
    console.error('Error in updateProblem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existingProblem, error: fetchError } = await supabase
      .from('problems')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking problem:', fetchError);
      return res.status(500).json({ error: 'Failed to check problem' });
    }

    if (!existingProblem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const { error } = await supabase
      .from('problems')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting problem:', error);
      return res.status(500).json({ error: 'Failed to delete problem' });
    }

    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProblem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
