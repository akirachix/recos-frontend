import React from "react";
import { Job, useFetchJobs } from "@/app/hooks/useFetchJobs";
import { useCompany } from "@/app/context/CompanyContext";

interface BarChartProps {
  jobs: Job[];
}

const BarChart: React.FC<BarChartProps> = ({ jobs }) => {
  const getChartDimensions = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      const baseWidth = Math.min(width - 32, 800);
      if (width < 640) return { width: baseWidth, height: 300, barWidth: 24, barSpacing: 12 };
      if (width < 1024) return { width: baseWidth, height: 350, barWidth: 30, barSpacing: 15 };
      return { width: baseWidth, height: 400, barWidth: 36, barSpacing: 18 };
    }
    return { width: 700, height: 400, barWidth: 36, barSpacing: 18 };
  };

  const [dimensions, setDimensions] = React.useState(getChartDimensions());

  React.useEffect(() => {
    const handleResize = () => setDimensions(getChartDimensions());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width: chartWidth, height: chartHeight, barWidth: fixedBarWidth, barSpacing: fixedBarSpacing } = dimensions;
  const padding = 60;
  const extraBarLeftPadding = 20;

  const applicantsByJob: Record<string, number> = {};
  jobs.slice(0, 10).forEach((job) => {
    applicantsByJob[job.job_title] = (applicantsByJob[job.job_title] || 0) + job.applicants;
  });

  const jobTitles = Object.keys(applicantsByJob);
  const maxApplicants = Math.max(...Object.values(applicantsByJob), 1);

  const requiredChartWidth = Math.max(
    chartWidth,
    2 * padding + extraBarLeftPadding + jobTitles.length * (fixedBarWidth + fixedBarSpacing)
  );

  return (
    <div className="bg-pink-50 rounded-lg shadow w-full max-w-3xl mx-auto">
      <div className="overflow-x-auto p-2 sm:p-3 md:p-4">
        <h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 mb-3 sm:mb-4 md:mb-6">
          Applicants per Job
        </h3>
        <svg
          width={requiredChartWidth}
          height={chartHeight}
          className="min-w-[300px] max-w-full"
          aria-label="Bar chart showing applicants per job"
        >
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padding + ((chartHeight - 2 * padding) * i) / 4;
            const value = Math.round(maxApplicants * (1 - i / 4));
            return (
              <g key={i}>
                <line
                  x1={padding}
                  x2={requiredChartWidth - padding}
                  y1={y}
                  y2={y}
                  stroke="#ddd6fe"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  fontSize={dimensions.width < 640 ? 10 : dimensions.width < 1024 ? 11 : 12}
                  fill="#7c3aed"
                  textAnchor="end"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {jobTitles.map((title, i) => {
            const x = padding + extraBarLeftPadding + i * (fixedBarWidth + fixedBarSpacing);
            const barHeight = (applicantsByJob[title] / maxApplicants) * (chartHeight - 2 * padding);
            const y = chartHeight - padding - barHeight;

            return (
              <g key={title}>
                <rect
                  x={x}
                  y={y}
                  width={fixedBarWidth}
                  height={barHeight}
                  fill="#7c3aed"
                />
                <text
                  x={x + fixedBarWidth / 2}
                  y={chartHeight - padding + 40}
                  fontSize={dimensions.width < 640 ? 9 : dimensions.width < 1024 ? 10 : 11}
                  fill="#7c3aed"
                  fontWeight="600"
                  textAnchor="middle"
                  transform={`rotate(45, ${x + fixedBarWidth / 2}, ${chartHeight - padding + 70})`}
                >
                  {title.length > 12 ? `${title.slice(0, 9)}...` : title}
                </text>
                <text
                  x={x + fixedBarWidth / 2}
                  y={y - 5}
                  fontSize={dimensions.width < 640 ? 8 : dimensions.width < 1024 ? 9 : 10}
                  fill="#4b5563"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {applicantsByJob[title]}
                </text>
              </g>
            );
          })}

          <text
            x={padding / 3}
            y={chartHeight / 2}
            fontSize={dimensions.width < 640 ? 12 : dimensions.width < 1024 ? 13 : 14}
            fill="#7c3aed"
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(-90, ${padding / 3}, ${chartHeight / 2})`}
          >
            Number of Candidates
          </text>

          <text
            x={requiredChartWidth / 2}
            y={chartHeight - padding / 3}
            fontSize={dimensions.width < 640 ? 12 : dimensions.width < 1024 ? 13 : 14}
            fill="#7c3aed"
            fontWeight="600"
            textAnchor="middle"
          >
            Job Position
          </text>

          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke="#ddd6fe"
            strokeWidth={2}
          />
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={requiredChartWidth - padding}
            y2={chartHeight - padding}
            stroke="#ddd6fe"
            strokeWidth={2}
          />
        </svg>
      </div>
    </div>
  );
};

const Dashboard = ({ companyId }: { companyId?: string }) => {
  const { selectedCompany } = useCompany();
  const { jobs, loading, error } = useFetchJobs({
    companyId: selectedCompany?.company_id,
    syncOnMount: true,
  });

  if (loading) {
    return (
      <div className="bg-pink-50 rounded-lg shadow w-full max-w-3xl mx-auto">
        <div className="p-2 sm:p-3 md:p-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600"></div>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm md:text-base">
            Loading job data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-pink-50 rounded-lg shadow w-full max-w-3xl mx-auto">
        <div className="p-2 sm:p-3 md:p-4 text-center">
          <p className="text-red-600 text-xs sm:text-sm md:text-base">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-pink-50 rounded-lg shadow w-full max-w-3xl mx-auto">
        <div className="p-2 sm:p-3 md:p-4 text-center text-gray-500 text-xs sm:text-sm md:text-base">
          No job data available
        </div>
      </div>
    );
  }

  return <BarChart jobs={jobs} />;
};

export default Dashboard;