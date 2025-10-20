
"use client"
interface AboutSectionProps {
  about: string;
}

export default function AboutSection({ about }: AboutSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
      <p className="text-gray-600 leading-relaxed">{about}</p>
    </div>
  );
}