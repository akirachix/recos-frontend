import React from "react";
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import * as nextNavigation from "next/navigation";
import useCandidates from "../../hooks/useCandidates";
import CandidatesRoutePage from "./page";

import { CompanyProvider } from "../../context/CompanyContext";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock("@/app/hooks/useFetchCompanies", () => ({
  useCompanies: jest.fn(() => ({
    companies: [{ company_id: "1", company_name: "Test Company" }],
    isLoading: false,
  })),
}));

const renderWithCompanyProvider = (ui: React.ReactElement) => {
  return render(<CompanyProvider>{ui}</CompanyProvider>);
};

const mockedUseParams = nextNavigation.useParams as jest.Mock;
const mockedUsePathname = nextNavigation.usePathname as jest.Mock;
const mockedUseRouter = nextNavigation.useRouter as jest.Mock;

jest.mock("../../hooks/useCandidates", () => ({
  __esModule: true,
  default: jest.fn(),
}));


interface Attachment {
  attachment_id: number;
  original_filename: string;
  name: string;
  download_url: string;
}

interface Candidate {
  candidate_id: number;
  name: string;
  job_title?: string | null;
  state: string;
  email: string;
  phone: string;
  generated_skill_summary?: string | null;
  attachments: Attachment[];
}

const mockedUseCandidates = useCandidates as jest.Mock;

const sampleCandidates: Candidate[] = [
  {
    candidate_id: 1,
    name: "Angie Angela",
    job_title: "Software Engineer",
    state: "applied",
    email: "angie@gmail.com",
    phone: "0768719803",
    generated_skill_summary: "SKILLS SUMMARY===Angie's summarry content.",
    attachments: [
      {
        attachment_id: 11,
        original_filename: "Angie_CV.pdf",
        name: "CV",
        download_url: "/api/download/11",
      }
    ],
  },
  {
    candidate_id: 2,
    name: "Sage Bahati",
    job_title: "Developer",
    state: "interview",
    email: "sage@gmail.com",
    phone: "0797669028",
    generated_skill_summary: null,
    attachments: [],
  },
];

describe("CandidatesPage", () => {
  beforeEach(() => {
    mockedUseParams.mockReturnValue({ companyId: "1" });
    mockedUsePathname.mockReturnValue("/some-path");
    mockedUseRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      reload: jest.fn(),
    });
    mockedUseCandidates.mockReset();
  });

  test("renders loading state", async () => {
    mockedUseCandidates.mockReturnValue({
      candidates: [],
      loading: true,
      error: null,
    });
    renderWithCompanyProvider(<CandidatesRoutePage />);
    await waitFor(() => {
      expect(screen.getByText(/loading candidates/i)).toBeInTheDocument();
    });
  });

  test("renders error state", async () => {
    mockedUseCandidates.mockReturnValue({
      candidates: [],
      loading: false,
      error: "Failed to load",
    });
    renderWithCompanyProvider(<CandidatesRoutePage />);
    await waitFor(() => {
      expect(screen.getByText(/error: failed to load/i)).toBeInTheDocument();
    });
  });

  test("renders candidate list and selects first candidate by default", async () => {
    mockedUseCandidates.mockReturnValue({
      candidates: sampleCandidates,
      loading: false,
      error: null,
    });
    renderWithCompanyProvider(<CandidatesRoutePage />);
    await waitFor(() => {
      const candidatesNamedAngie = screen.getAllByText("Angie Angela");
      expect(candidatesNamedAngie.length).toBeGreaterThan(0);
      expect(screen.getByText("Sage Bahati")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("About")).toBeInTheDocument();
    });
  });

  test("filters candidate list on search input", async () => {
    mockedUseCandidates.mockReturnValue({
      candidates: sampleCandidates,
      loading: false,
      error: null,
    });
    renderWithCompanyProvider(<CandidatesRoutePage />);
    const input = screen.getByPlaceholderText(/search candidates by name/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: "sage" } });
    });

    mockedUseCandidates.mockReturnValue({
      candidates: [sampleCandidates[1]], 
      loading: false,
      error: null,
    });

    await waitFor(() => {
      expect(screen.getByText("Sage Bahati")).toBeInTheDocument();
    });
  });

  test("selects candidate on click", async () => {
    mockedUseCandidates.mockReturnValue({
      candidates: sampleCandidates,
      loading: false,
      error: null,
    });
    renderWithCompanyProvider(<CandidatesRoutePage />);
    const candidate = screen.getByText("Sage Bahati");
    await userEvent.click(candidate);
    await waitFor(() => {
      expect(screen.getByText((content, element) => content.includes("sage@gmail.com"))).toBeInTheDocument();
    });
  });

  test("shows 'no candidates found' for empty list", async () => {
    mockedUseCandidates.mockReturnValue({
      candidates: [],
      loading: false,
      error: null,
    });
    renderWithCompanyProvider(<CandidatesRoutePage />);
    await waitFor(() => {
      expect(screen.getByText(/no candidates found/i)).toBeInTheDocument();
    });
  });


});
