"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/shared-components/Navbar";
import Sidebar from "@/app/shared-components/Sidebar";
import { useCompany } from "@/app/context/CompanyContext";
import { useDashboardData } from "@/app/hooks/useDashboardData";
import MetricCard from "../components/MetricsCard";
import SimpleLineChart from "../components/SimpleLineChart";
import SimpleDonutChart from "../components/SimpleCandidatesChart";
import UpcomingInterviews from "../components/UpcomingInterview";
import ClientLayout from "@/app/shared-components/ClientLayout";

function DashboardContent() {
  const params = useParams();
  const companyId = params.companyId as string;
  const { selectedCompany, companies, setSelectedCompany } = useCompany();
  const { metrics, loading, error } = useDashboardData(companyId);
  const [isGeneralView, setIsGeneralView] = useState(!companyId);

  useEffect(() => {
    if (companyId && companies.length > 0) {
      const company = companies.find((c) => c.company_id.toString() === companyId);
      if (company && company.company_id !== selectedCompany?.company_id) {
        setSelectedCompany(company);
      }
      setIsGeneralView(false);
    } else {
      setIsGeneralView(true);
    }
  }, [companyId, companies, selectedCompany, setSelectedCompany]);

  return (
    <ClientLayout>
      {loading ? (
        <div className="flex justify-center items-center h-screen text-gray-500 text-sm sm:text-base md:text-lg">
          Loading...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-screen text-red-500 text-sm sm:text-base md:text-lg">
          Error: {error}
        </div>
      ) : (
        <div className="flex min-h-screen flex-col sm:flex-row">
          <Sidebar />
          <div className="flex-1 flex flex-col w-full">
            <Navbar />
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full max-w-[1440px] mx-auto">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
                {isGeneralView
                  ? "General Dashboard"
                  : selectedCompany
                  ? `${selectedCompany.company_name} Dashboard`
                  : "Dashboard"}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <MetricCard title="Open Positions" value={metrics?.openPositions || 0} />
                <MetricCard title="Interviews" value={metrics?.completedInterviews || 0} />
                <MetricCard title="Total Candidates" value={metrics?.totalCandidates || 0} />
              </div>
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-6">
                <div className="flex-1 min-w-0">
                  <SimpleLineChart />
                </div>
                <div className="flex-1 min-w-0">
                  <SimpleDonutChart />
                </div>
              </div>
              <div className="mb-6 w-full">
                <UpcomingInterviews />
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}

export default DashboardContent;