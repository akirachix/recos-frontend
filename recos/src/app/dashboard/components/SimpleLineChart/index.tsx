import React from "react";

interface MonthlyData {
  month: string;
  [key: string]: number | string;
}

interface MultiLineChartProps {
  data: MonthlyData[];
  seriesNames: string[];
  seriesColors: string[];
}

const chartHeight = 400;
const chartWidth = 600;
const padding = 50;

function linearInterpolate(startValue: number, endValue: number, interpolationFactor: number) {
  return startValue + (endValue - startValue) * interpolationFactor;
}

function generateSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";

  let pathData = `M ${points[0].x} ${points[0].y}`;

  for (let currentIndex = 0; currentIndex < points.length - 1; currentIndex++) {
    const startPoint = points[currentIndex];
    const endPoint = points[currentIndex + 1];
    const controlPoint1X = linearInterpolate(startPoint.x, endPoint.x, 0.7);
    const controlPoint1Y = startPoint.y;
    const controlPoint2X = linearInterpolate(startPoint.x, endPoint.x, 0.3);
    const controlPoint2Y = endPoint.y;

    pathData += ` C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endPoint.x} ${endPoint.y}`;
  }
  return pathData;
}

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MultiLineChart: React.FC<MultiLineChartProps> = ({
  data,
  seriesNames,
  seriesColors,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No data available
      </div>
    );
  }

  const allValues = data.flatMap((d) =>
    seriesNames.map((name) => Number(d[name] || 0))
  );
  const maxValue = Math.max(...allValues, 1);

  const xStep = (chartWidth - 2 * padding) / (months.length - 1);

const monthNameToIndexMap = months.reduce<Record<string, number>>((accumulator, monthName, monthIndex) => {
  accumulator[monthName] = monthIndex;
  return accumulator;
}, {});

  const paths = seriesNames.map((series, i) => {
    const points = data
      .map((item) => {
        const monthName = item.month as string;
        const x = padding + (monthNameToIndexMap [monthName] || 0) * xStep;
        const y =
          chartHeight -
          padding -
          (Number(item[series]) / maxValue) * (chartHeight - 2 * padding);
        return { x, y };
      })
      .filter((p) => !isNaN(p.y));
    return {
      path: generateSmoothPath(points),
      points,
      color: seriesColors[i] || "#000",
      name: series,
    };
  });

  return (
    <div className="bg-pink-50 rounded-xl p-4 max-w-4xl">
      <h3 className="font-semibold mt-2 text-gray-900 text-xl">Most Applied Positions</h3>
      <svg
        width="100%"
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding + i * ((chartHeight - 2 * padding) / 4);
          return (
            <line
              key={i}
              x1={padding}
              x2={chartWidth - padding}
              y1={y}
              y2={y}
              stroke="#f3e8ff"
              strokeWidth={1}
            />
          );
        })}
        {months.map((_, i) => {
          const x = padding + i * xStep;
          return (
            <line
              key={i}
              y1={padding}
              y2={chartHeight - padding}
              x1={x}
              x2={x}
              stroke="#f3e8ff"
              strokeWidth={1}
            />
          );
        })}
        <line
          x1={padding}
          y1={chartHeight - padding}
          x2={chartWidth - padding}
          y2={chartHeight - padding}
          stroke="#ddd6fe"
          strokeWidth={1}
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={chartHeight - padding}
          stroke="#ddd6fe"
          strokeWidth={1}
        />
        {paths.map(({ path, color }, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {months.map((month, i) => (
          <text
            key={i}
            x={padding + i * xStep}
            y={chartHeight - padding + 22}
            textAnchor="middle"
            fontSize={11}
            fill="#7c3aed"
            fontWeight="600"
          >
            {month}
          </text>
        ))}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding + i * ((chartHeight - 2 * padding) / 4);
          const value = Math.round(maxValue - (i * maxValue) / 4);
          return (
            <text
              key={i}
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              fontSize={11}
              fill="#7c3aed"
              fontWeight="600"
            >
              {value}
            </text>
          );
        })}
      </svg>
      <div className="mt-4 flex gap-6 flex-wrap">
        {seriesNames.map((name, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: seriesColors[i] }}
            ></div>
            <span className="text-violet-600" style={{ marginLeft: "10px" }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
const Dashboard = () => {
  const data = [
    { month: "Jan", "QA Analyst": 350, "Financial Analyst": 220, Manager: 500 },
    { month: "Feb", "QA Analyst": 450, "Financial Analyst": 360, Manager: 480 },
    { month: "Mar", "QA Analyst": 700, "Financial Analyst": 670, Manager: 550 },
    { month: "Apr", "QA Analyst": 850, "Financial Analyst": 680, Manager: 600 },
    { month: "May", "QA Analyst": 870, "Financial Analyst": 710, Manager: 630 },
    { month: "Jun", "QA Analyst": 750, "Financial Analyst": 560, Manager: 580 },
    { month: "Jul", "QA Analyst": 600, "Financial Analyst": 720, Manager: 680 },
    { month: "Aug", "QA Analyst": 650, "Financial Analyst": 820, Manager: 720 },
    { month: "Sep", "QA Analyst": 700, "Financial Analyst": 900, Manager: 730 },
    { month: "Oct", "QA Analyst": 800, "Financial Analyst": 950, Manager: 780 },
    { month: "Nov", "QA Analyst": 720, "Financial Analyst": 980, Manager: 800 },
    { month: "Dec", "QA Analyst": 750, "Financial Analyst": 900, Manager: 830 },
  ];
  const seriesNames = ["QA Analyst", "Financial Analyst", "Manager"];
  const seriesColors = ["#6366f1", "#22d3ee", "#a78bfa"];
  return <MultiLineChart data={data} seriesNames={seriesNames} seriesColors={seriesColors} />;
};

export default Dashboard;
