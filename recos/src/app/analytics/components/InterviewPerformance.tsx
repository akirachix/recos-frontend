
"use client";

interface PerformanceItem {
  name: string;
  value: 'High' | 'Medium' | 'Low';
}

interface InterviewPerformanceProps {
  performance: PerformanceItem[];
}

export default function InterviewPerformance({ performance }: InterviewPerformanceProps) {
  const getBarHeight = (value: 'High' | 'Medium' | 'Low'): string => {
    if (value === 'High') return '100%';
    if (value === 'Medium') return '66%';
    if (value === 'Low') return '33%';
    return '0%';
  };

  const getBarColor = (value: 'High' | 'Medium' | 'Low'): string => {
    if (value === 'High') return 'bg-green-500';
    if (value === 'Medium') return 'bg-yellow-500';
    if (value === 'Low') return 'bg-red-500';
    return 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Interview Performance Analysis</h3>
      <div className="flex justify-around items-end h-40">
        {performance.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="w-12 bg-gray-200 rounded-t relative" style={{ height: '120px' }}>
              <div 
                className={`absolute bottom-0 w-full ${getBarColor(item.value)} rounded-t transition-all duration-300`}
                style={{ height: getBarHeight(item.value) }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center w-16">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}