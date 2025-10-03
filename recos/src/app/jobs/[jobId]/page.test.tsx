import { render, screen, waitFor } from '@testing-library/react';
import { formatButtonStatus, formatDropdownStatus } from './page';
import JobDetailsPage from './page';
import { useFetchJobDetails } from '@/app/hooks/useFetchJobDetails';
import { useParams } from 'next/navigation';
import { act } from 'react';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/app/hooks/useFetchJobDetails', () => ({
  useFetchJobDetails: jest.fn(),
}));

jest.mock('@/app/context/SidebarContext', () => ({
  useSidebar: jest.fn(),
}));

jest.mock('@/app/shared-components/ClientLayout', () => {
  const MockClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;
  MockClientLayout.displayName = 'ClientLayout';
  return MockClientLayout;
});

jest.mock('@/app/shared-components/Sidebar', () => {
  const MockSidebar: React.FC = () => <div>Mocked Sidebar</div>;
  MockSidebar.displayName = 'Sidebar';
  return MockSidebar;
});

describe('JobDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useParams as jest.Mock).mockReturnValue({ jobId: '123' });

    (jest.requireMock('next/navigation').usePathname as jest.Mock).mockReturnValue('/jobs/123');

    (jest.requireMock('next/navigation').useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    });

    (jest.requireMock('@/app/context/SidebarContext').useSidebar as jest.Mock).mockReturnValue({
      isCollapsed: false,
      toggleSidebar: jest.fn(),
      sidebarWidth: 240,
    });

    (useFetchJobDetails as jest.Mock).mockReturnValue({
      job: {
        job_title: 'Senior Developer',
        created_at: '2025-09-30',
        generated_job_summary: 'A great job opportunity',
        job_description: '<p>Job description here</p>',
        status: 'open',
      },
      candidates: [
        { id: 1, name: 'John Doe', email: 'john@example.com', stage: 'Applied', interview_status: 'Scheduled' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', stage: 'Interview', interview_status: 'Pending' },
      ],
      loading: false,
      error: null,
      updating: false,
      handleStateUpdate: jest.fn().mockResolvedValue(undefined),
    });
  });

  describe('Utility Functions', () => {
    describe('formatButtonStatus', () => {
      test('should format "open" to "Open"', () => {
        expect(formatButtonStatus('open')).toBe('Open');
      });

      test('should format "pause" to "Paused"', () => {
        expect(formatButtonStatus('pause')).toBe('Paused');
      });

      test('should format "close" to "Closed"', () => {
        expect(formatButtonStatus('close')).toBe('Closed');
      });

      test('should format "cancel" to "Canceled"', () => {
        expect(formatButtonStatus('cancel')).toBe('Canceled');
      });


      test('should format non-standard status like "test" to "Tested"', () => {
        expect(formatButtonStatus('test')).toBe('Tested');
      });
    });

    describe('formatDropdownStatus', () => {
      test('should format "open" to "Open"', () => {
        expect(formatDropdownStatus('open')).toBe('Open');
      });

      test('should format "pause" to "Pause"', () => {
        expect(formatDropdownStatus('pause')).toBe('Pause');
      });

      test('should format "close" to "Close"', () => {
        expect(formatDropdownStatus('close')).toBe('Close');
      });

      test('should format "cancel" to "Cancel"', () => {
        expect(formatDropdownStatus('cancel')).toBe('Cancel');
      });

      test('should format non-standard status like "test" to "Test"', () => {
        expect(formatDropdownStatus('test')).toBe('Test');
      });
    });
  });

  describe('Component Rendering', () => {
    test('should render job title and candidates correctly', async () => {
      await act(async () => {
        render(<JobDetailsPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Senior Developer')).toBeInTheDocument();

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Total Applicants')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    test('should display loading state', async () => {
      (useFetchJobDetails as jest.Mock).mockReturnValue({
        job: null,
        candidates: [],
        loading: true,
        error: null,
        updating: false,
        handleStateUpdate: jest.fn().mockResolvedValue(undefined),
      });

      await act(async () => {
        render(<JobDetailsPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Loading job details...')).toBeInTheDocument();
      });
    });

    test('should display error state', async () => {
      (useFetchJobDetails as jest.Mock).mockReturnValue({
        job: null,
        candidates: [],
        loading: false,
        error: 'Failed to fetch job details',
        updating: false,
        handleStateUpdate: jest.fn().mockResolvedValue(undefined),
      });

      await act(async () => {
        render(<JobDetailsPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Error: Failed to fetch job details')).toBeInTheDocument();
      });
    });

    test('should display job not found state', async () => {
      (useFetchJobDetails as jest.Mock).mockReturnValue({
        job: null,
        candidates: [],
        loading: false,
        error: null,
        updating: false,
        handleStateUpdate: jest.fn().mockResolvedValue(undefined),
      });

      await act(async () => {
        render(<JobDetailsPage />);
      });

      await waitFor(() => {
        expect(screen.getByText('Job not found')).toBeInTheDocument();
      });
    });
  });
});
