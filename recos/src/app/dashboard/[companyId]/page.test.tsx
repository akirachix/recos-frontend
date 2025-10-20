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
  useDashboardData: jest.fn(),
}));

const mockUseDashboardData = jest.requireMock('@/app/hooks/useDashboardData').useDashboardData;

describe('DashboardPage', () => {
  beforeEach(() => {
    mockUseDashboardData.mockReturnValue({
      metrics: {
        openPositions: 10,
        completedInterviews: 5,
        totalCandidates: 20,
      },
      loading: false,
      error: null,
    });
  });
  it('renders loading state', () => {
    mockUseDashboardData.mockReturnValue({
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

});