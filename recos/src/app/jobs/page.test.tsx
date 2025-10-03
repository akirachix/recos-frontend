import { render, screen, waitFor } from '@testing-library/react';
import { formatButtonStatus } from './page';
import JobsPage from './page';
import { useFetchJobs } from '@/app/hooks/useFetchJobs';
import { useCompany } from '@/app/context/CompanyContext';
import { act } from 'react';
import '@testing-library/jest-dom';

jest.mock('@/app/hooks/useFetchJobs', () => ({
  useFetchJobs: jest.fn(),
}));

jest.mock('@/app/context/CompanyContext', () => ({
  useCompany: jest.fn(),
}));

jest.mock('@/app/shared-components/ClientLayout', () => {
  const MockClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;
  MockClientLayout.displayName = 'ClientLayout';
  return MockClientLayout;
});

jest.mock('./components/Positions', () => {
  const MockPosition: React.FC<{ value: number; title: string; icon: React.ComponentType }> = ({ value, title, icon: Icon }) => (
    <div>
      <Icon />
      <span>{title}: {value}</span>
    </div>
  );
  MockPosition.displayName = 'Position';
  return MockPosition;
});

describe('JobsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useCompany as jest.Mock).mockReturnValue({
      selectedCompany: { company_id: '123' },
    });

    (useFetchJobs as jest.Mock).mockReturnValue({
      jobs: [
        {
          job_id: '1',
          job_title: 'Senior Developer',
          applicants: 10,
          ai_shortlisted: 2,
          posted_at: '2025-09-30',
          status: 'open',
        },
        {
          job_id: '2',
          job_title: 'Product Manager',
          applicants: 5,
          ai_shortlisted: 1,
          posted_at: '2025-09-29',
          status: 'pause',
        },
      ],
      loading: false,
      syncing: false,
      error: null,
      refetch: jest.fn().mockResolvedValue(undefined),
      syncAndFetchJobs: jest.fn().mockResolvedValue(undefined),
    });
  });

  describe('Utility Function: formatButtonStatus', () => {
    test('should format "open" to "Open"', () => {
      expect(formatButtonStatus('open')).toBe('Open');
    });

    test('should format "pause" to "Paused"', () => {
      expect(formatButtonStatus('pause')).toBe('Paused');
    });

    test('should format "close" to "Closed"', () => {
      expect(formatButtonStatus('close')).toBe('Closed');
    });

    test('should format "cancel" to "Cancelled"', () => {
      expect(formatButtonStatus('cancel')).toBe('Canceled');
    });

    test('should handle case insensitivity for "OPEN"', () => {
      expect(formatButtonStatus('open')).toBe('Open');
    });

    test('should format non-standard status like "test" to "Tested"', () => {
      expect(formatButtonStatus('test')).toBe('Tested');
    });
  });

  describe('Component Rendering', () => {
    test('should render job list and position stats correctly', async () => {
      await act(async () => {
        render(<JobsPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Senior Developer')).toBeInTheDocument();
        expect(screen.getByText('Product Manager')).toBeInTheDocument();

        expect(screen.getByText('Total Jobs: 2')).toBeInTheDocument();
        expect(screen.getByText('Open Positions: 1')).toBeInTheDocument();
        expect(screen.getByText('Paused Positions: 1')).toBeInTheDocument();
        expect(screen.getByText('Closed Positions: 0')).toBeInTheDocument();
      });
    });

    test('should display loading state', async () => {
      (useFetchJobs as jest.Mock).mockReturnValue({
        jobs: [],
        loading: true,
        syncing: false,
        error: null,
        refetch: jest.fn().mockResolvedValue(undefined),
        syncAndFetchJobs: jest.fn().mockResolvedValue(undefined),
      });

      await act(async () => {
        render(<JobsPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Loading jobs...')).toBeInTheDocument();
      });
    });

    test('should display error state', async () => {
      (useFetchJobs as jest.Mock).mockReturnValue({
        jobs: [],
        loading: false,
        syncing: false,
        error: 'Failed to fetch jobs',
        refetch: jest.fn().mockResolvedValue(undefined),
        syncAndFetchJobs: jest.fn().mockResolvedValue(undefined),
      });

      await act(async () => {
        render(<JobsPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Error loading jobs: Failed to fetch jobs')).toBeInTheDocument();
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    test('should display no jobs found when jobs array is empty', async () => {
      (useFetchJobs as jest.Mock).mockReturnValue({
        jobs: [],
        loading: false,
        syncing: false,
        error: null,
        refetch: jest.fn().mockResolvedValue(undefined),
        syncAndFetchJobs: jest.fn().mockResolvedValue(undefined),
      });

      await act(async () => {
        render(<JobsPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('No jobs found for this company.')).toBeInTheDocument();
        expect(screen.getByText('Try syncing to get the latest jobs.')).toBeInTheDocument();
      });
    });

    test('should display sync status message when syncing', async () => {
      (useFetchJobs as jest.Mock).mockReturnValue({
        jobs: [],
        loading: false,
        syncing: true,
        error: null,
        refetch: jest.fn().mockResolvedValue(undefined),
        syncAndFetchJobs: jest.fn().mockResolvedValue(undefined),
      });

      await act(async () => {
        render(<JobsPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Syncing jobs from Odoo...')).toBeInTheDocument();
      });
    });
  });
});
