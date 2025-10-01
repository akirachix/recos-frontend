
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: string;
  isPositive?: boolean;
}
const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  isPositive = true 
}) => {
  return (
    <div className="bg-purple-800 rounded-lg shadow p-6  w-full mt-5 mb-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white text-lg">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-white">{value}</h3>
          {change !== undefined && (
            <div className={`flex items-center mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <svg
                className={`h-4 w-4 ${isPositive ? '' : 'transform rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span className="text-sm ml-1">{change}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="bg-blue-100 p-3 rounded-lg">
            <span className="text-blue-500 text-xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;