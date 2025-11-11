import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronRight, CheckCircle } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import { api } from '../services/api';
import { Problem } from '../lib/supabase';

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProblem = async () => {
      if (!id) return;

      try {
        const problemData = await api.getProblem(id);
        setProblem(problemData);

        const progressData = await api.getProgress();
        const solved = progressData.some((p) => p.problem_id === id && p.solved);
        setIsSolved(solved);
      } catch (error) {
        console.error('Error loading problem:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [id]);

  const handleMarkAsSolved = async () => {
    if (!id) return;

    try {
      await api.markAsSolved(id);
      setIsSolved(true);
    } catch (error) {
      console.error('Error marking as solved:', error);
      alert('Failed to mark as solved');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-900/30 border-green-700';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      case 'hard':
        return 'text-red-400 bg-red-900/30 border-red-700';
      default:
        return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading problem...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Problem not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <div className="h-6 w-px bg-gray-700" />
            <h1 className="text-xl font-bold text-white">{problem.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getDifficultyColor(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm capitalize">
              {problem.category}
            </span>
            {isSolved && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm border border-green-700">
                <CheckCircle className="w-4 h-4" />
                Solved
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 overflow-y-auto bg-gray-900 border-r border-gray-800 p-6">
          <div className="space-y-6 max-w-3xl">
            {problem.hint && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
                >
                  <span className="font-semibold text-yellow-400">Hint</span>
                  {showHint ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {showHint && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-300">{problem.hint}</p>
                  </div>
                )}
              </div>
            )}

            {problem.explanation && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
                >
                  <span className="font-semibold text-blue-400">Explanation</span>
                  {showExplanation ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {showExplanation && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-300 whitespace-pre-line">{problem.explanation}</p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3">Complexity</h3>
              <div className="space-y-2">
                {problem.time_complexity && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Time:</span>
                    <code className="text-green-400 font-mono">{problem.time_complexity}</code>
                  </div>
                )}
                {problem.space_complexity && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Space:</span>
                    <code className="text-green-400 font-mono">{problem.space_complexity}</code>
                  </div>
                )}
              </div>
            </div>

            {(problem.sample_input || problem.sample_output) && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3">Sample</h3>
                {problem.sample_input && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-400 mb-1">Input:</p>
                    <pre className="text-gray-300 font-mono text-sm bg-gray-900 p-3 rounded">
                      {problem.sample_input}
                    </pre>
                  </div>
                )}
                {problem.sample_output && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Output:</p>
                    <pre className="text-gray-300 font-mono text-sm bg-gray-900 p-3 rounded">
                      {problem.sample_output}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {!isSolved && (
              <button
                onClick={handleMarkAsSolved}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Solved
              </button>
            )}
          </div>
        </div>

        <div className="w-1/2 flex flex-col">
          <CodeEditor starterCode={problem.starter_code} onReset={() => {}} />
        </div>
      </div>
    </div>
  );
}
