import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    const problemsFile = join(__dirname, '../problems_seed.json');
    const problemsData = JSON.parse(readFileSync(problemsFile, 'utf-8'));

    console.log(`Loaded ${problemsData.length} problems from seed file`);

    const { data: existingProblems, error: checkError } = await supabase
      .from('problems')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing problems:', checkError);
      process.exit(1);
    }

    if (existingProblems && existingProblems.length > 0) {
      console.log('Database already contains problems. Skipping seed.');
      console.log('To re-seed, manually delete problems from Supabase dashboard first.');
      process.exit(0);
    }

    const batchSize = 50;
    for (let i = 0; i < problemsData.length; i += batchSize) {
      const batch = problemsData.slice(i, i + batchSize);

      const { error: insertError } = await supabase
        .from('problems')
        .insert(batch);

      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError);
        process.exit(1);
      }

      console.log(`Inserted batch ${i / batchSize + 1} (${batch.length} problems)`);
    }

    const { count, error: countError } = await supabase
      .from('problems')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting problems:', countError);
    } else {
      console.log(`\nSeeding completed successfully!`);
      console.log(`Total problems in database: ${count}`);
    }

    const { data: byDifficulty } = await supabase
      .from('problems')
      .select('difficulty')
      .then(({ data }) => {
        const counts = { easy: 0, medium: 0, hard: 0 };
        data?.forEach(p => counts[p.difficulty]++);
        return { data: counts };
      });

    if (byDifficulty) {
      console.log('\nBreakdown by difficulty:');
      console.log(`  Easy: ${byDifficulty.easy}`);
      console.log(`  Medium: ${byDifficulty.medium}`);
      console.log(`  Hard: ${byDifficulty.hard}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  }
}

seedDatabase();
