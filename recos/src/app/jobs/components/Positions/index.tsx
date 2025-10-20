import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface PositionProps {
    value: number;
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export default function Position({ value, title, icon: Icon }: PositionProps) {
    return (
        <div className="bg-[#141344] text-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2"> 
                <h1 className="text-3xl font-bold">{value}</h1>
                <Icon className="h-6 w-6" />
            </div>
            <p>{title}</p>
            <ArrowLeftIcon className="h-5 w-5 mt-2 text-green-500 rotate-135" />
        </div>
    );
}