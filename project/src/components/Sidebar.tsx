import { Filter, Plus } from 'lucide-react';

type SidebarProps = {
  selectedDifficulty: string;
  selectedCategory: string;
  onDifficultyChange: (difficulty: string) => void;
  onCategoryChange: (category: string) => void;
  onAddProblem: () => void;
};

const difficulties = ['all', 'easy', 'medium', 'hard'];
const categories = ['all', 'arrays', 'strings', 'stack', 'queue', 'linkedlist', 'tree', 'graph'];

export default function Sidebar({
  selectedDifficulty,
  selectedCategory,
  onDifficultyChange,
  onCategoryChange,
  onAddProblem,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">DSA Practice</h1>
        <p className="text-gray-400 text-sm">Master algorithms & data structures</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Difficulty</h2>
        </div>
        <div className="space-y-2">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="capitalize">{diff}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Category</h2>
        </div>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="capitalize">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={onAddProblem}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Problem
        </button>
      </div>
    </aside>
  );
}
