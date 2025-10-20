
import { render, screen, within } from '@testing-library/react';
import DashboardPage from './page';
import { CompanyProvider } from '@/app/context/CompanyContext';
import React from "react";

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
}));

jest.mock('@/app/hooks/useDashboardData', () => ({
  useDashboardData: jest.fn(() => ({
    metrics: {
      openPositions: 10,
      completedInterviews: 5,
      totalCandidates: 20,
    },
    loading: false,
    error: null,
  })),
}));

describe('DashboardPage', () => {
  it('renders dashboard with metrics', () => {
    render(
      <CompanyProvider>
        <DashboardPage />
      </CompanyProvider>
    );
    expect(screen.getByText(/General Dashboard/i)).toBeInTheDocument();

    const openPositionsCard = screen.getByText(/Open Positions/i).closest('div');
    expect(openPositionsCard).toBeInTheDocument();
    expect(within(openPositionsCard!).getByText('10')).toBeInTheDocument();

    const completedInterviewsCard = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.startsWith('Interviews');
    });
    expect(completedInterviewsCard).toBeInTheDocument();
    expect(within(completedInterviewsCard!.closest('div')!).getByText('5')).toBeInTheDocument();

    const totalCandidatesCard = screen.getAllByText(/Total Candidates/i)[0].closest('div');
    expect(totalCandidatesCard).toBeInTheDocument();
    expect(within(totalCandidatesCard!).getByText('20')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    const useDashboardDataMock = require('@/app/hooks/useDashboardData');
    useDashboardDataMock.useDashboardData.mockReturnValue({
      metrics: null,
      loading: true,
      error: null,
    });

    render(
      <CompanyProvider>
        <DashboardPage />
      </CompanyProvider>
    );

    const main = screen.getByRole('main');
    expect(within(main).getByText(/Loading.../i)).toBeInTheDocument();
  });
  
  it('renders error state', () => {
    const useDashboardDataMock = require('@/app/hooks/useDashboardData');
    useDashboardDataMock.useDashboardData.mockReturnValue({
      metrics: null,
      loading: false,
      error: 'Failed to load metrics',
    });
    render(
      <CompanyProvider>
        <DashboardPage />
      </CompanyProvider>
    );
    expect(screen.getByText(/Error: Failed to load metrics/i)).toBeInTheDocument();
  });
});
