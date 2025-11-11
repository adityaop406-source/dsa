import { useNavigate } from 'react-router-dom';
import { Problem } from '../lib/supabase';
import { CheckCircle2, Circle } from 'lucide-react';

type DashboardProps = {
  problems: Problem[];
  solvedIds: Set<string>;
};

export default function Dashboard({ problems, solvedIds }: DashboardProps) {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-3">
      {problems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No problems found with the selected filters.</p>
        </div>
      ) : (
        problems.map((problem) => {
          const isSolved = solvedIds.has(problem.id);
          return (
            <div
              key={problem.id}
              onClick={() => navigate(`/problem/${problem.id}`)}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-blue-600 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {isSolved ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {problem.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded capitalize">
                        {problem.category}
                      </span>
                      <span className={`text-sm font-medium capitalize ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
