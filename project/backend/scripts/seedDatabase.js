import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    const seedFilePath = join(__dirname, 'problems_seed.json');
    const problemsData = JSON.parse(readFileSync(seedFilePath, 'utf-8'));

    console.log(`Found ${problemsData.length} problems to seed`);

    const { data: existingProblems, error: countError } = await supabase
      .from('problems')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error('Error checking existing problems:', countError);
      process.exit(1);
    }

    if (existingProblems && existingProblems.length > 0) {
      console.log(`Database already has problems. Clearing existing data...`);

      const { error: deleteError } = await supabase
        .from('problems')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) {
        console.error('Error clearing problems:', deleteError);
      } else {
        console.log('Existing problems cleared');
      }
    }

    const batchSize = 50;
    let successCount = 0;

    for (let i = 0; i < problemsData.length; i += batchSize) {
      const batch = problemsData.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('problems')
        .insert(batch)
        .select();

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      } else {
        successCount += data.length;
        console.log(`Inserted batch ${i / batchSize + 1}: ${data.length} problems`);
      }
    }

    console.log(`\nSeeding complete! Successfully inserted ${successCount} problems`);

    const { data: summary, error: summaryError } = await supabase
      .from('problems')
      .select('difficulty, category');

    if (!summaryError && summary) {
      const difficultyCount = {
        Easy: 0,
        Medium: 0,
        Hard: 0
      };

      const categoryCount = {};

      summary.forEach(problem => {
        difficultyCount[problem.difficulty] = (difficultyCount[problem.difficulty] || 0) + 1;
        categoryCount[problem.category] = (categoryCount[problem.category] || 0) + 1;
      });

      console.log('\nSummary:');
      console.log('By Difficulty:', difficultyCount);
      console.log('By Category:', categoryCount);
    }

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
