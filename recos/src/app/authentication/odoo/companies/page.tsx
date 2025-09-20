"use client";
import Image from "next/image";
import Button from "@/app/authentication/components/Button";
import { useCompanies } from "@/app/hooks/useFetchCompanies";
import { useToken } from "@/app/hooks/useToken";
import { useRouter } from "next/navigation";

export default function CompaniesExactStyledPage() {
  const router = useRouter();
  const token = useToken();
  const { companies, isLoading, error } = useCompanies(token);

  const handleAddCompanyClick = () => {
    router.push("/authentication/odoo");
  };
  const handleCompanyClick = (companyId: string) => {
    router.push(`/dashboard/${companyId}`);
  };

  if (!token) {
    return (
      <p className="text-center mt-10 text-white">
        Please log in to view your companies.
      </p>
    );
  }

  const companyList = Array.isArray(companies) ? companies : [];

  return (
    <div className="min-h-screen bg-[#141244] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-lg max-w-7xl w-full mx-auto h-[800px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <div className="p-4 sm:p-6 md:p-10 flex flex-col gap-20 min-h-[400px] sm:min-h-[500px]">
            <Image
              src="/recos_purple.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
            />
            <h2 className="text-xl sm:text-2xl md:text-3xl text-[#803CEB] font-bold mb-4 text-center">
              Companies List
            </h2>

            {isLoading && <p>Loading companies...</p>}
            {error && <p className="text-red-500">Error loading companies</p>}

            <div className="flex flex-col space-y-4 w-full max-w-md mx-auto">
              {companyList.map((comp) => (
                <Button
                  key={comp.company_id}
                  variant="secondary"
                  className="text-gray-800 py-2 sm:py-3 text-sm sm:text-base md:text-lg hover:bg-purple-50 transition duration-300 font-semibold border cursor-pointer"
                  onClick={() => handleCompanyClick(comp.company_id)}
                >
                  {comp.company_name}
                </Button>
              ))}

              <div className="flex justify-center">
                <Button
                  variant="primary"
                  className="w-32 sm:w-40 md:w-60 py-2 sm:py-3 rounded-full font-bold cursor-pointer"
                  onClick={handleAddCompanyClick}
                >
                  + Add Company
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[80px] sm:min-h-[800px]">
            <div className="relative bg-[#803CEB] text-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg flex flex-col items-center justify-center text-center w-full max-w-8xl min-h-[100px] sm:min-h-[700px]">
              <h3 className="text-2xl sm:text-3xl md:text-3xl font-bold">
                Want to connect to a different Instance?
              </h3>
              <p className="text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl leading-relaxed mt-4">
                To sync company candidate data, please connect your Odoo
                account. Your credentials are securely encrypted and never
                shared.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
