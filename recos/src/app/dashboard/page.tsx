"use client";
import { useParams } from "next/navigation";
import ClientLayout from "../shared-components/ClientLayout";

export default function Dashboard() {
  const params = useParams();
  const companyId = params.companyId;

  return (
    <ClientLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Dashboard content for Company ID: {companyId}</p>
      </div>
    </ClientLayout>
  );
}
