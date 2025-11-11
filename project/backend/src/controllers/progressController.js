import { supabase } from '../config/supabase.js';

export const markAsSolved = async (req, res) => {
  try {
    const { userId, problemId } = req.body;

    const { data: existingProgress, error: checkError } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', userId)
      .eq('problem_id', problemId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking progress:', checkError);
      return res.status(500).json({ error: 'Failed to check progress' });
    }

    if (existingProgress) {
      return res.status(200).json({ message: 'Already solved' });
    }

    const { data, error } = await supabase
      .from('progress')
      .insert([{
        user_id: userId,
        problem_id: problemId,
        solved_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error marking as solved:', error);
      return res.status(500).json({ error: 'Failed to mark as solved' });
    }

    res.status(201).json({ message: 'Marked as solved', progress: data });
  } catch (error) {
    console.error('Error in markAsSolved:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProgress = async (req, res) => {
  try {
    const { userId, category, difficulty } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    let query = supabase
      .from('progress')
      .select(`
        *,
        problems:problem_id (
          id,
          title,
          category,
          difficulty
        )
      `)
      .eq('user_id', userId);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching progress:', error);
      return res.status(500).json({ error: 'Failed to fetch progress' });
    }

    let filteredData = data;

    if (category) {
      filteredData = filteredData.filter(
        item => item.problems?.category === category
      );
    }

    if (difficulty) {
      filteredData = filteredData.filter(
        item => item.problems?.difficulty === difficulty
      );
    }

    const summary = {
      total: filteredData.length,
      byDifficulty: {
        Easy: filteredData.filter(item => item.problems?.difficulty === 'Easy').length,
        Medium: filteredData.filter(item => item.problems?.difficulty === 'Medium').length,
        Hard: filteredData.filter(item => item.problems?.difficulty === 'Hard').length
      },
      byCategory: {}
    };

    filteredData.forEach(item => {
      const cat = item.problems?.category;
      if (cat) {
        summary.byCategory[cat] = (summary.byCategory[cat] || 0) + 1;
      }
    });

    res.json({
      progress: filteredData,
      summary
    });
  } catch (error) {
    console.error('Error in getProgress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProgress = async (req, res) => {
  try {
    const { userId, problemId } = req.body;

    if (!userId || !problemId) {
      return res.status(400).json({ error: 'userId and problemId are required' });
    }

    const { error } = await supabase
      .from('progress')
      .delete()
      .eq('user_id', userId)
      .eq('problem_id', problemId);

    if (error) {
      console.error('Error deleting progress:', error);
      return res.status(500).json({ error: 'Failed to delete progress' });
    }

    res.json({ message: 'Progress removed successfully' });
  } catch (error) {
    console.error('Error in deleteProgress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
