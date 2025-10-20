import React from "react";
import { useParams } from "next/navigation";
import { useDashboardData } from "@/app/hooks/useDashboardData";

type CandidateState = "applied" | "qualified" | "interviewed" | "offer" | "hired";
type CandidateStateCounts = {
  [key in CandidateState]: number;
} & { total: number };

interface Candidate {
  state: CandidateState;
}

interface SimpleDonutChartProps {
  data: CandidateStateCounts;
}

const stateColors: Record<CandidateState, string> = {
  applied: "#4c1d95",
  qualified: "#6b21a8",
  interviewed: "#a78bfa",
  offer: "#facc15",
  hired: "#22c55e",
};

const SimpleDonutChart: React.FC<SimpleDonutChartProps> = ({ data }) => {
  const states: CandidateState[] = [
    "applied",
    "qualified",
    "interviewed",
    "offer",
    "hired",
  ];

  const getChartSize = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) return 100;
      if (width < 1024) return 140;
      return 180;
    }
    return 180;
  };

  const [chartSize, setChartSize] = React.useState(getChartSize());

  React.useEffect(() => {
    const handleResize = () => setChartSize(getChartSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const size = chartSize;
  const strokeWidth = size * 0.1667;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const filteredStates = states.filter((state) => data[state] > 0);
  const circles = filteredStates.map((state) => {
    const count = data[state];
    const percent = data.total > 0 ? (count / data.total) * 100 : 0;
    const dasharray = `${(percent / 100) * circumference} ${circumference}`;
    const rotation = -90 + (cumulativePercent / 100) * 360;
    cumulativePercent += percent;
    return (
      <circle
        key={state}
        cx={center}
        cy={center}
        r={radius}
        stroke={stateColors[state]}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={dasharray}
        transform={`rotate(${rotation} ${center} ${center})`}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div className="bg-pink-50 rounded-lg shadow w-full max-w-3xl mx-auto">
      <div className="overflow-hidden p-2 sm:p-3 md:p-4">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">
          Candidates Summary
        </h3>
        <div className="flex flex-col sm:grid sm:grid-cols-[max-content_1fr] gap-3 sm:gap-6 md:gap-8 items-center mx-auto mt-4 sm:mt-6 md:mt-8 w-full max-w-[90vw] sm:max-w-[480px] md:max-w-[520px]">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="min-w-[100px] max-w-full"
            aria-label="Donut chart showing candidate states"
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#e0e0e0"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {circles}
          </svg>
          <div className="flex flex-col space-y-2 sm:space-y-4 md:space-y-6 justify-center w-full">
            {states.map((state) => (
              <div key={state} className="flex items-center">
                <span
                  className="block w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 md:mr-4"
                  style={{ backgroundColor: stateColors[state] }}
                />
                <span className="capitalize font-semibold text-gray-700 text-xs sm:text-sm md:text-base">
                  {state}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 font-medium ml-2">
                  ({data[state]})
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 sm:mt-4 md:mt-6 text-center text-gray-700 font-semibold text-xs sm:text-sm md:text-base">
          Total Candidates: {data.total}
        </div>
      </div>
    </div>
  );
};

const CandidateSummaryChart = ({ companyId: propCompanyId }: { companyId?: string }) => {
  const params = useParams();
  const urlCompanyId = params.companyId as string;
  const finalCompanyId = propCompanyId || urlCompanyId;

  const { candidates, loading, error } = useDashboardData(finalCompanyId);
  const validStates: CandidateState[] = [
    "applied",
    "qualified",
    "interviewed",
    "offer",
    "hired",
  ];
  const initialCounts: CandidateStateCounts = {
    applied: 0,
    qualified: 0,
    interviewed: 0,
    offer: 0,
    hired: 0,
    total: 0,
  };

  const stateCounts = Array.isArray(candidates)
    ? candidates.reduce<CandidateStateCounts>((acc, candidate) => {
        if (candidate.state && validStates.includes(candidate.state as CandidateState)) {
          acc[candidate.state as CandidateState]++;
        }
        acc.total++;
        return acc;
      }, initialCounts)
    : initialCounts;

  if (loading) {
    return (
      <div className="bg-pink-50 rounded-lg shadow w-full max-w-3xl mx-auto">
        <div className="p-2 sm:p-3 md:p-4 h-48 sm:h-64 flex justify-center items-center">
          <div className="text-gray-500 text-xs sm:text-sm md:text-base">Loading candidate data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-pink-50 rounded-lg shadow w-full max-w-3xl mx-auto">
        <div className="p-2 sm:p-3 md:p-4 h-48 sm:h-64 flex justify-center items-center text-red-500 text-xs sm:text-sm md:text-base">
          Error loading candidate data: {error}
        </div>
      </div>
    );
  }

  return <SimpleDonutChart data={stateCounts} />;
};

export default CandidateSummaryChart;