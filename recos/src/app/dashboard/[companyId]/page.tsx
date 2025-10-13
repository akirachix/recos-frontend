'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/shared-components/Navbar';
import Sidebar from '@/app/shared-components/Sidebar';
import {useCompany } from '@/app/context/CompanyContext';
import { useDashboardData } from '@/app/hooks/useDashboardData';
import MetricCard from '../components/MetricsCard';
import SimpleLineChart from '../components/SimpleLineChart';
import SimpleDonutChart from '../components/SimpleCandidatesChart';
import UpcomingInterviews from '../components/UpcomingInterview';
import JobSummary from '../components/JobSummary';
import ClientLayout from '@/app/shared-components/ClientLayout';


function DashboardContent() {
  const params = useParams();
  const companyId = params.companyId as string;
  const { selectedCompany, companies, setSelectedCompany } = useCompany();
  const { metrics, loading, error } = useDashboardData(companyId);
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


  return (
    <ClientLayout>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <div className="px-6  py-6">
              <h1 className="text-2xl font-bold mb-6">
                {isGeneralView ? 'General Dashboard' : selectedCompany? `${selectedCompany.company_name} Dashboard` : 'Dashboard'}
              </h1>
              <div className="flex gap-6 mb-6 justify-between">
                <MetricCard title="Open Positions" value={metrics?.openPositions || 0} />
                <MetricCard title="Interviews" value={metrics?.completedInterviews || 0} />
                <MetricCard title="Total Candidates" value={metrics?.totalCandidates || 0} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-6">
                <SimpleLineChart />
                <SimpleDonutChart />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-6">
                <UpcomingInterviews />
                <JobSummary />
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
export default DashboardContent;
