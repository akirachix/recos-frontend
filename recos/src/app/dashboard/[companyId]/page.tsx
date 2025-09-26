"use client";
import { useParams, useRouter } from "next/navigation";
import ClientLayout from "../../shared-components/ClientLayout";
import { useEffect } from "react";
import { useCompany } from "@/app/context/CompanyContext";

function DashboardContent() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;
  const { selectedCompany, companies, setSelectedCompany, isLoading } = useCompany();

  useEffect(() => {
    if (companyId && companies.length > 0) {
      const company = companies.find(c => c.company_id === companyId);
      if (company && (!selectedCompany || selectedCompany.company_id !== companyId)) {
        console.log("Setting selected company to:", company);
        setSelectedCompany(company);
      }
    }
  }, [companyId, companies, selectedCompany, setSelectedCompany]);

  useEffect(() => {
    if (!isLoading && !selectedCompany && companies.length > 0) {
      console.log("No company selected, redirecting to first company:", companies[0]);
      router.push(`/dashboard/${companies[0].company_id}`);
    }
  }, [selectedCompany, companies, router, isLoading]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading company information...</p>
      </div>
    );
  }

  if (!isLoading && companies.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No companies found. Please connect your Odoo account to get started.
              </p>
              <button
                onClick={() => router.push("/authentication/odoo")}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Connect Odoo Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Jobs</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
          <p className="text-sm text-gray-500 mt-1">Active job postings</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Candidates</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
          <p className="text-sm text-gray-500 mt-1">Total candidates</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Interviews</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
          <p className="text-sm text-gray-500 mt-1">Scheduled interviews</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ClientLayout>
      <DashboardContent />
    </ClientLayout>
  );
}