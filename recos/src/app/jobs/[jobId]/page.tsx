'use client';

import { Candidate, useFetchJobDetails } from '@/app/hooks/useFetchJobDetails';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import ClientLayout from '@/app/shared-components/ClientLayout';
import Link from 'next/link';
import { EyeIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Button from '@/app/shared-components/Button';

const JOB_STATES = [
  { value: 'open', label: 'Open' },
  { value: 'pause', label: 'Paused' },
  { value: 'close', label: 'Closed' },
  { value: 'cancel', label: 'Cancelled' },
];

const formatButtonStatus = (status: string) => {
  if (status.toLowerCase() === 'open') {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
  else if (status.toLowerCase().endsWith('e')) {
    return status.charAt(0).toUpperCase() + status.slice(1) + 'd';
  }
  else{
  return status.charAt(0).toUpperCase() + status.slice(1) + 'ed';
  }
};

const formatDropdownStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const { job, candidates: fetchedCandidates, loading, error, updating, handleStateUpdate } = useFetchJobDetails(jobId);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pageSizes = [5, 10, 20];
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const stateDropdownRef = useRef<HTMLDivElement>(null);

  const candidates = fetchedCandidates;

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
    const handleClickOutside = (event: MouseEvent) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-[#141244]'; 
      case 'pause': return 'bg-yellow-600'; 
      case 'close': return 'bg-green-500'; 
      case 'cancel': return 'bg-gray-600'; 
      default: return 'bg-gray-800'; 
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'text-[#141244]'; 
      case 'pause': return 'text-yellow-600'; 
      case 'close': return 'text-green-500'; 
      case 'cancel': return 'text-gray-600'; 
      default: return 'text-gray-800'; 
    }
  };

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCandidates = filteredCandidates.length;
  const totalPages = Math.ceil(totalCandidates / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <ClientLayout>
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
            <span className="ml-4 text-lg text-gray-600">Loading job details...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 text-center">Error: {error}</div>
        ) : !job ? (
          <div className="p-4 text-center">Job not found</div>
        ) : (
          <>
            <div className="mb-6">
              <Link href="/jobs" className="text-blue-600 hover:underline">Back to jobs</Link>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-purple-800">{job.job_title}</h1>
                <div className="flex items-center space-x-2">
                  <span>Created on</span>
                  <span className="p-1 bg-gray-100 rounded">{job.created_at}</span>
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="p-4 bg-pink-100 shadow-sm rounded-lg w-3/4">
                  <h3 className="font-semibold">Job Summary</h3>
                  <p className="text-sm">
                    {job.generated_job_summary && typeof job.generated_job_summary === 'string' && job.generated_job_summary.trim() !== ''
                      ? job.generated_job_summary
                      : 'No job summary'}
                  </p>
                  <div className="flex justify-end mt-2">
                    <button
                      className="px-4 py-1 bg-none underline text-black rounded flex items-center"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? 'Hide Job Description' : 'View Job Description'}
                      <ChevronDownIcon
                        className={`ml-2 h-4 w-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  {showFullDescription && (
                    <div className="mt-2">
                      {job.job_description && typeof job.job_description === 'string' && job.job_description.trim() !== '' && job.job_description !== 'False' ? (
                        <div
                          className="text-sm"
                          dangerouslySetInnerHTML={{ __html: job.job_description }}
                        />
                      ) : (
                        <p className="text-sm text-gray-500">No job description</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-1/4 gap-6">
                  <div className="bg-pink-100 rounded-lg p-4 flex flex-col justify-center items-center gap-2 shadow-sm">
                    <h3 className="font-semibold">Total Applicants</h3>
                    <div className="text-3xl font-bold text-purple-800">{candidates.length}</div>
                  </div>
                  <div className="relative" ref={stateDropdownRef}>
                    <button
                      className={`px-8 py-2 rounded w-full flex items-center justify-between ${getStatusColor(job.status)} text-white`}
                      onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                      disabled={updating}
                    >
                      {updating ? 'Updating...' : formatButtonStatus(job.status)}
                      <ChevronDownIcon className={`ml-2 h-4 w-4 transition-transform ${isStateDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isStateDropdownOpen && (
                      <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 animate-fade-in">
                        <ul className="py-1 text-md text-[#803CEB]" role="listbox">
                          {JOB_STATES.map((state) => (
                            <li
                              key={state.value}
                              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 ${
                                job.state === state.value ? 'bg-gray-50 font-semibold' : ''
                              } ${getStatusTextColor(state.value)}`}
                              onClick={() => {
                                setIsStateDropdownOpen(false); 
                                handleStateUpdate(state.value);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  setIsStateDropdownOpen(false); 
                                  handleStateUpdate(state.value);
                                }
                              }}
                              role="option"
                              tabIndex={0}
                              aria-selected={job.state === state.value}
                            >
                              {formatDropdownStatus(state.value)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold w-1/2">List of Candidates</h2>
                <div className="flex gap-8 justify-end items-center w-1/2">
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    className="p-2 border border-gray-500 rounded w-1/2 focus:border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="relative flex items-center" ref={dropdownRef}>
                    <p className="text-white bg-[#141344] rounded-bl-sm rounded-tl-sm p-2">Candidates per page</p>
                    <Button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      variant="purple"
                      size="md"
                      className="flex items-center justify-between w-32 sm:w-20 text-md py-2 rounded-br-sm rounded-tr-sm transition-colors duration-200 cursor-pointer"
                    >
                      {pageSize}
                      <ChevronDownIcon
                        className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </Button>
                    {isDropdownOpen && (
                      <div
                        className="absolute top-full right-0 mt-1 w-20 bg-white border border-gray-200 rounded shadow-lg z-50 animate-fade-in max-h-40 overflow-y-auto"
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
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-purple-100 rounded-lg overflow-hidden">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Stage</th>
                      <th className="p-3 text-left">Interview Status</th>
                      <th className="p-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCandidates.length > 0 ? (
                      paginatedCandidates.map((candidate) => (
                        <tr key={candidate.id} className="bg-white hover:bg-gray-50">
                          <td className="p-3 flex items-center">{candidate.name}</td>
                          <td className="p-3">{candidate.email}</td>
                          <td className="p-3">
                            <span
                              className={`px-4 py-1 rounded-sm text-sm font-medium ${
                                candidate.stage === 'Applied' ? 'bg-[#141344] text-white' :
                                candidate.stage === 'Interview' ? 'bg-blue-500 text-white' :
                                candidate.stage === 'Offer' ? 'bg-green-500 text-white' :
                                candidate.stage === 'Screening' ? 'bg-yellow-500 text-white' :
                                'bg-gray-500 text-white'
                              }`}
                            >
                              {candidate.stage}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-4 py-1 rounded-sm text-sm font-medium ${
                                candidate.interview_status === 'Scheduled' ? 'bg-[#141344] text-white' :
                                candidate.interview_status === 'Pending' ? 'bg-yellow-500 text-white' :
                                candidate.interview_status === 'Completed' ? 'bg-green-500 text-white' :
                                'bg-red-500 text-white'
                              }`}
                            >
                              {candidate.interview_status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button className="p-1 flex border-[#141344] text-sm border-1 text-[#141344] rounded cursor-pointer">
                              <EyeIcon className="h-5 w-5 text-gray-500 mr-1" aria-hidden="true" />
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-gray-500">
                          No candidates found for this job
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalCandidates > 0 && (
                <div className="mt-4 flex justify-center items-center space-x-2">
                  <button
                    className={`px-4 py-2 rounded ${
                      currentPage === 1
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-purple-600 cursor-pointer'
                    }`}
                    onClick={handlePrevious}
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
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronDoubleRightIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ClientLayout>
  );
}