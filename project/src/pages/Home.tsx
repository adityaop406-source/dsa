import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import ProgressBar from '../components/ProgressBar';
import AddProblemModal from '../components/AddProblemModal';
import { api } from '../services/api';
import { Problem, Progress } from '../lib/supabase';

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const filters: any = {};
      if (selectedDifficulty !== 'all') filters.difficulty = selectedDifficulty;
      if (selectedCategory !== 'all') filters.category = selectedCategory;

      const [problemsData, progressData] = await Promise.all([
        api.getProblems(filters),
        api.getProgress(),
      ]);

      setProblems(problemsData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDifficulty, selectedCategory]);

  const solvedIds = new Set(progress.filter((p) => p.solved).map((p) => p.problem_id));
  const totalProblems = problems.length;
  const solvedCount = problems.filter((p) => solvedIds.has(p.id)).length;

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        selectedDifficulty={selectedDifficulty}
        selectedCategory={selectedCategory}
        onDifficultyChange={setSelectedDifficulty}
        onCategoryChange={setSelectedCategory}
        onAddProblem={() => setShowAddModal(true)}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          <div className="mb-6">
            <ProgressBar solved={solvedCount} total={totalProblems} />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading problems...</p>
            </div>
          ) : (
            <Dashboard problems={problems} solvedIds={solvedIds} />
          )}
        </div>
      </main>

      {showAddModal && (
        <AddProblemModal
          onClose={() => setShowAddModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
