
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/shared-components/Navbar';
import Sidebar from '@/app/shared-components/Sidebar';
import { CompanyProvider, useCompany } from '@/app/context/CompanyContext';
import { SidebarProvider } from '@/app/context/SidebarContext';
import { useDashboardData } from '@/app/hooks/useDashboardData';
import MetricCard from '../components/MetricsCard';
import SimpleLineChart from '../components/SimpleLineChart';
import SimpleDonutChart from '../components/SimpleDonutChart';
import UpcomingInterviews from '../components/UpcomingInterview';
import JobSummary from '../components/JobSummary';

function DashboardContent() {
  const params = useParams();
  const companyId = params.companyId as string;
  const { selectedCompany, companies, setSelectedCompany } = useCompany();
  const {
    jobs,
    interviews,
    metrics,
    loading,
    error
  } = useDashboardData(companyId);
  const [isGeneralView, setIsGeneralView] = useState(!companyId);
  useEffect(() => {
    if (companyId && companies.length > 0) {
      const company = companies.find(c => c.company_id.toString() === companyId);
      if (company && company.company_id !== selectedCompany?.company_id) {
        setSelectedCompany(company);
      }
      setIsGeneralView(false);
    } else {
      setIsGeneralView(true);
    }
  }, [companyId, companies, selectedCompany, setSelectedCompany]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-6 flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-6 flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">Error</div>
              <div className="text-gray-700 mb-6">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {isGeneralView ? 'General Dashboard' : selectedCompany ? `${selectedCompany.company_name} Dashboard` : 'Dashboard'}
          </h1>

          <div className="flex  gap-6 mb-6 mt-20 ml-70 justify-between ">
            <MetricCard
              title="Open Positions"
              value={metrics?.openPositions || 0}
            />
            <MetricCard
              title="Completed Interviews"
              value={metrics?.completedInterviews || 0}
            />
            <MetricCard
              title="Total Candidates"
              value={metrics?.totalCandidates || 0}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-6 ml-70">
            <SimpleLineChart />
            <SimpleDonutChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-6 ml-70">
            <UpcomingInterviews />
            <JobSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <CompanyProvider>
        <DashboardContent />
      </CompanyProvider>
    </SidebarProvider>
  );
}