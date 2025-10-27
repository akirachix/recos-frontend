'use client';
import { useFetchJobs } from '@/app/hooks/useFetchJobs';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { EyeIcon, BriefcaseIcon, ArrowTopRightOnSquareIcon, ClipboardDocumentCheckIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PauseIcon} from '@heroicons/react/24/outline';
import Position from './components/Positions';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import ClientLayout from '@/app/shared-components/ClientLayout';
import { useCompany } from '@/app/context/CompanyContext';

import Loader from '@/app/shared-components/Loader'; 


export const formatButtonStatus = (status: string) => {
  if (status.toLowerCase() === 'open') {
    return status.charAt(0).toUpperCase() + status.slice(1);
  } else if (status.toLowerCase().endsWith('e')) {
    return status.charAt(0).toUpperCase() + status.slice(1) + 'd';
  } else {
    return status.charAt(0).toUpperCase() + status.slice(1) + 'ed';
  }
};

function JobsPageContent() {
  const { selectedCompany } = useCompany();
  const { jobs, loading,refetch } = useFetchJobs({
    companyId: selectedCompany?.company_id,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pageSizes = [5, 10, 20];

  const [isInitialFetch, setIsInitialFetch] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsInitialFetch(false);
    }
  }, [loading]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-[#141244]';
      case 'pause': return 'bg-yellow-600';
      case 'close': return 'bg-green-500';
      case 'cancel': return 'bg-gray-600';
      default: return 'bg-gray-800';
    }
  };

  useEffect(() => {
    const handleJobUpdate = () => {
      refetch();
    };
    window.addEventListener('jobUpdated', handleJobUpdate);
    return () => {
      window.removeEventListener('jobUpdated', handleJobUpdate);
    };
  }, [refetch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCompany]);

  const filteredJobs = jobs.filter((job) =>
    job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalJobs = loading ? 0 : filteredJobs.length;
  const openPositions = loading ? 0 : filteredJobs.filter((job) => job.status.toLowerCase() === 'open').length;
  const closedPositions = loading ? 0 : filteredJobs.filter((job) => job.status.toLowerCase() === 'close').length;
  const pausedPositions = loading ? 0 : filteredJobs.filter((job) => job.status.toLowerCase() === 'pause').length;
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
  });
  const totalPages = Math.ceil(totalJobs / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = sortedJobs.slice(startIndex, endIndex);

  const positions = [
    { value: totalJobs, title: 'Total Jobs', icon: BriefcaseIcon },
    { value: openPositions, title: 'Open Positions', icon: ArrowTopRightOnSquareIcon },
    { value: pausedPositions, title: 'Paused Positions', icon: PauseIcon },
    { value: closedPositions, title: 'Closed Positions', icon: ClipboardDocumentCheckIcon },
  ];

  return (
    <div className="p-4">

      <div className="grid grid-cols-4 gap-4 mb-6">
        {positions.map((pos, index) => (
          <div key={index}>
            <Position value={pos.value} title={pos.title} icon={pos.icon} />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search positions..."
          className="p-2 border border-gray-500 rounded w-1/2 focus:border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="relative flex items-center" ref={dropdownRef}>
          <p className="text-white bg-[#141244] rounded-bl-sm rounded-tl-sm p-2">Job position per page</p>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-evenly w-32 sm:w-20 text-md py-2 rounded-br-sm rounded-tr-sm transition-colors duration-200 cursor-pointer bg-purple-600 text-white"
          >
            {pageSize}
            <ChevronDownIcon
              className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isDropdownOpen && (
            <div
              className="absolute top-full flex right-0 mt-1 w-20 bg-white border border-gray-200 rounded shadow-lg z-50 animate-fade-in max-h-40 overflow-y-auto"
            >
              <ul className="py-1 text-md text-[#803CEB]" role="listbox">
                {pageSizes.map((size, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 ${
                      pageSize === size ? 'bg-gray-50 font-semibold' : ''
                    }`}
                    onClick={() => {
                      setPageSize(size);
                      setCurrentPage(1);
                      setIsDropdownOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setPageSize(size);
                        setCurrentPage(1);
                        setIsDropdownOpen(false);
                      }
                    }}
                    role="option"
                    tabIndex={0}
                    aria-selected={pageSize === size}
                  >
                    {size}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
   <div className="overflow-x-auto">
  <table className="w-full border-collapse bg-purple-100 rounded-lg overflow-hidden">
    <thead className="bg-purple-600 text-white">
      <tr>
        <th className="p-3 text-left">Job Title</th>
        <th className="p-3 text-left">Applicants</th>
        <th className="p-3 text-left">AI Shortlisted</th>
        <th className="p-3 text-left">Date Posted</th>
        <th className="p-3 text-left">Status</th>
        <th className="p-3 text-left">Action</th>
      </tr>
    </thead>
    <tbody>
      {loading || isInitialFetch ? (
        <tr>
          <td colSpan={6} className="p-8 text-center">
            <Loader size="md" message="Loading jobs..." className="py-4" />
          </td>
        </tr>
      ) : jobs.length === 0 ? (
        <tr>
          <td colSpan={6} className="p-8 text-center text-gray-500">
            <p>No jobs found for this company.</p>
          </td>
        </tr>
      ) : paginatedJobs.length === 0 ? (
        <tr>
          <td colSpan={6} className="p-8 text-center text-gray-500">
            No jobs match your search criteria.
          </td>
        </tr>
      ) : (
        paginatedJobs.map((job) => (
          <tr key={job.job_id} className="bg-white hover:bg-gray-50">
            <td className="p-3">{job.job_title}</td>
            <td className="p-3">{job.applicants}</td>
            <td className="p-3">{job.ai_shortlisted}</td>
            <td className="p-3">{job.posted_at}</td>
            <td className="p-3">
              <span
                className={`px-4 py-1 rounded-sm text-sm font-medium text-white ${getStatusColor(job.status)}`}
              >
                {formatButtonStatus(job.status)}
              </span>
            </td>
            <td className="p-3">
              <Link href={`/jobs/${job.job_id}`}>
                <button className="p-1 flex gap-1 border-[#141344] text-sm border-1 text-[#141344] rounded mr-2 cursor-pointer hover:bg-purple-50 transition-colors">
                  <EyeIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  View Details
                </button>
              </Link>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-purple-600 cursor-pointer'
          }`}
          onClick={() => {
            if (currentPage > 1) setCurrentPage(currentPage - 1);
          }}
          disabled={currentPage === 1}
        >
          <ChevronDoubleLeftIcon className="h-5 w-5" />
        </button>
        <span className="text-[#141344]">{currentPage} of {totalPages}</span>
        <button
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-purple-600 cursor-pointer'
          }`}
          onClick={() => {
            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
        >
          <ChevronDoubleRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <ClientLayout>
      <JobsPageContent />
    </ClientLayout>
  );
}