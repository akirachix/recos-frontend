import React from "react";
import { useFetchInterviews } from "@/app/hooks/useFetchInterviews";

const UpcomingInterviews: React.FC = () => {
  const { events, loading, error } = useFetchInterviews();

  const upcomingInterviews = events.filter(event => new Date(event.date) > new Date());

  if (loading) return <p>Loading upcoming interviews...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (upcomingInterviews.length === 0) return <p>No upcoming interviews.</p>;

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <h3 className="text-xl font-semibold mb-4 text-purple-800">Upcoming Interviews</h3>
      <ul className="space-y-4 max-h-80 overflow-auto">
        {upcomingInterviews.map((interview, idx) => {
          const startTime = new Date(interview.date);
          const formattedDate = startTime.toLocaleDateString(undefined, {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          });
          const formattedTime = startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <li key={idx} className="flex flex-col border-b pb-2">
              <p className="font-semibold">{`${formattedDate} ${formattedTime}`}</p>
              <p className="text-[#7c3aed] text-sm">
                Interview with {interview.candidate_name || "Candidate"}  {interview.position || ""}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default UpcomingInterviews;
