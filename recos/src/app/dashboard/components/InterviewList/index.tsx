import { InterviewItem } from "@/app/types";

interface InterviewListProps {
  interviews: InterviewItem[];
}
const InterviewList: React.FC<InterviewListProps> = ({ interviews }) => {
  return (
    <div className="bg-purple-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Interviews</h3>
      <div className="space-y-4">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <div key={interview.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
              <div>
                <h4 className="font-medium">{interview.position}</h4>
                <p className="text-gray-500 text-sm">{interview.candidate}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{interview.time}</p>
                <p className="text-gray-500 text-sm">{interview.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No upcoming interviews</p>
        )}
      </div>
    </div>
  );
};

export default InterviewList;