import React from "react";

interface CandidateSummary {
  reviewed: number;
  pending: number;
  total: number;
}
interface SimpleDonutChartProps {
  data: CandidateSummary;
}
const SimpleDonutChart: React.FC<SimpleDonutChartProps> = ({ data }) => {
  const total = data.reviewed + data.pending;
  const size = 180;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const reviewedPercentage = total > 0 ? (data.reviewed / total) * 100 : 0;
  const pendingPercentage = total > 0 ? (data.pending / total) * 100 : 0;
  const reviewedDasharray = `${(reviewedPercentage / 100) * circumference} ${circumference}`;
  const pendingDasharray = `${(pendingPercentage / 100) * circumference} ${circumference}`;
  const reviewedRotation = -90;
  const pendingRotation = reviewedRotation + (reviewedPercentage / 100) * 360;
  return (
    <div className="bg-pink-50 rounded-lg shadow p-6 max-w-4xl">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Candidates summary</h3>
      <div className="flex flex-col items-center">
        <div className="text-center mb-4">
          <p className="text-3xl font-bold text-violet-600">{total}</p>
          <p className="text-gray-700 font-semibold">Total Candidates</p>
        </div>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#e0e0e0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#4c1d95"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={reviewedDasharray}
            transform={`rotate(${reviewedRotation} ${center} ${center})`}
            strokeLinecap="round"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#a78bfa"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={pendingDasharray}
            transform={`rotate(${pendingRotation} ${center} ${center})`}
            strokeLinecap="round"
          />
        </svg>

        <div className="flex mt-4 space-x-6">
          <div className="flex items-center gap-2">
            <span className="block w-5 h-5 rounded-full bg-purple-900"></span>
            <span className="text-gray-700 text-sm font-medium">
              Reviewed ({data.reviewed})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block w-5 h-5 rounded-full bg-purple-400"></span>
            <span className="text-gray-700 text-sm font-medium">
              Pending ({data.pending})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
const CandidateSummaryChart = () => {
  const summaryData = {
    reviewed: 5,
    pending: 5,
    total: 10,
  };

  return <SimpleDonutChart data={summaryData} />;
};

export default CandidateSummaryChart;
