import React from 'react';

interface JobSummaryItem {
  name: string;
  reviewedCount: number;
  pendingCount: number;
}

interface JobSummaryBarChartProps {
  data: JobSummaryItem[];
}
const MAX_BAR_WIDTH = 150;
const JobSummaryBarChart: React.FC<JobSummaryBarChartProps> = ({ data }) => {
const maxTotal = Math.max(...data.map(d => d.reviewedCount + d.pendingCount), 1);
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl">
      <h3 className="text-xl font-semibold mb-4 ">Job summary</h3>
      <div className="space-y-4 overflow-auto max-h-80">
        {data.map((item, idx) => {
          const total = item.reviewedCount + item.pendingCount;
          const reviewedWidth = (item.reviewedCount / maxTotal) * MAX_BAR_WIDTH;
          const pendingWidth = (item.pendingCount / maxTotal) * MAX_BAR_WIDTH;
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-40 text-sm text-gray-700">{item.name}</div>
              <div className="flex flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                <div className="bg-gray-900 h-full" style={{ width: reviewedWidth }}></div>
                <div className="bg-purple-400 h-full" style={{ width: pendingWidth }}></div>
              </div>
              <div className="w-16 text-right text-sm text-gray-600">{total}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const JobSummaryBarChartExample = () => {
  const mockData: JobSummaryItem[] = [
    { name: 'Software Engineer', reviewedCount: 20, pendingCount: 40 },
    { name: 'Product Manager', reviewedCount: 35, pendingCount: 55 },
    { name: 'UI/UX Designer', reviewedCount: 10, pendingCount: 45 },
    { name: 'Data Analyst', reviewedCount: 20, pendingCount: 30 },
    { name: 'DevOps Engineer', reviewedCount: 50, pendingCount: 20 },
  ];
  return <JobSummaryBarChart data={mockData} />;
};
export default JobSummaryBarChartExample;