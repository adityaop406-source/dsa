type ProgressBarProps = {
  solved: number;
  total: number;
};

export default function ProgressBar({ solved, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300">Progress</span>
        <span className="text-sm text-gray-400">
          {solved} / {total} solved
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 text-center">
        <span className="text-lg font-bold text-white">{percentage}%</span>
      </div>
    </div>
  );
}
