"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useCompanies } from "@/app/hooks/useFetchCompanies";

interface Company {
  company_id: string;
  company_name: string;
}

interface CompanyContextType {
  selectedCompany: Company | null;
  companies: Company[];
  setSelectedCompany: (company: Company) => void;
  isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompany, setSelectedCompanyState] = useState<Company | null>(null);
  const { companies, isLoading } = useCompanies();

  const setSelectedCompany = (company: Company) => {
    setSelectedCompanyState(company);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCompany", JSON.stringify(company));
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCompany = localStorage.getItem("selectedCompany");
      if (savedCompany) {
        try {
          const parsedCompany = JSON.parse(savedCompany);
          if (companies.length > 0) {
            const companyExists = companies.some(c => c.company_id === parsedCompany.company_id);
            if (companyExists) {
              setSelectedCompanyState(parsedCompany);
            } else if (companies.length > 0) {
              setSelectedCompanyState(companies[0]);
            }
          }
        } catch (error) {
        }
      }
    }
  }, [companies]); 

  useEffect(() => {
    if (!selectedCompany && companies.length > 0) {
      setSelectedCompanyState(companies[0]);
    }
  }, [companies, selectedCompany]);

  return (
    <CompanyContext.Provider
      value={{
        selectedCompany,
        companies: companies || [],
        setSelectedCompany,
        isLoading: isLoading || false,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}