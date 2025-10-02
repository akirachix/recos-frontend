import React from 'react';

interface Interview {
  time: string;
  candidateName: string;
  position: string;
  status: 'completed' | 'pending';
}

interface UpcomingInterviewsProps {
  interviews: Interview[];
}
const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({ interviews }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl">
      <h3 className="text-xl font-semibold mb-4">Upcoming Interviews</h3>
      <ul className="space-y-4 max-h-80 overflow-auto">
        {interviews.map((interview, idx) => (
          <li key={idx} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold">{interview.time}</p>
                <p className="text-gray-600 text-sm">
                  Interview with {interview.candidateName} on {interview.position}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const UpcomingInterview = () => {
  const mockInterviews: Interview[] = [
    { time: '09.00 - 10.00 AM', candidateName: 'Johnny Gait', position: 'QA (Quality Assurance)', status: 'completed' },
    { time: '10.00 - 11.00 AM', candidateName: 'Alice Johnson', position: 'Product Manager', status: 'completed' },
    { time: '11.30 - 12.30 PM', candidateName: 'Bob Smith', position: 'Developer', status: 'pending' },
    { time: '01.00 - 02.00 PM', candidateName: 'Diana Prince', position: 'Designer', status: 'pending' },
  ];
  return <UpcomingInterviews interviews={mockInterviews} />;
};
export default UpcomingInterview;