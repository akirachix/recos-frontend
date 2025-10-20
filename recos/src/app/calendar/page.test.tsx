import { render, screen, waitFor } from '@testing-library/react';
import CalendarPage from './page';
import { useFetchInterviews } from '../hooks/useFetchInterviews';
import { useToken } from '../hooks/useToken';
import mockRouter from 'next-router-mock';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  usePathname: jest.fn().mockImplementation(() => mockRouter.pathname),
  useRouter: jest.fn(() => mockRouter),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('../hooks/useFetchInterviews');
jest.mock('../hooks/useToken');
jest.mock('./components/Calendar', () => {
  return function DummyCalendar(props: any) {
    return <div data-testid="simple-schedule">SimpleSchedule</div>;
  };
});

describe('CalendarPage', () => {
  const mockUseFetchInterviews = useFetchInterviews as jest.Mock;
  const mockUseToken = useToken as jest.Mock;

  beforeEach(() => {
    mockRouter.setCurrentUrl('/');
    mockUseToken.mockReturnValue('fake-token');
    (jest.requireMock('next/navigation').useParams as jest.Mock).mockReturnValue({ companyId: '1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading message and then renders schedule on successful data fetch', async () => {
    const mockEvents = [
      { id: 1, date: '2025-09-15T10:00:00Z', label: 'Interview 1' },
      { id: 2, date: '2025-09-16T14:00:00Z', label: 'Interview 2' },
    ];

    mockUseFetchInterviews.mockReturnValue({
      events: [],
      loading: true,
      error: null,
    });

    const { rerender } = render(<CalendarPage />);
    expect(await screen.findByText(/Loading interviews.../i)).toBeInTheDocument();

    mockUseFetchInterviews.mockReturnValue({
      events: mockEvents,
      loading: false,
      error: null,
    });

    rerender(<CalendarPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading interviews.../i)).not.toBeInTheDocument();
      expect(screen.getByTestId('simple-schedule')).toBeInTheDocument();
    });
  });

  it('shows error message when data fetching fails', async () => {
    const errorMessage = 'Failed to fetch interviews';
    mockUseFetchInterviews.mockReturnValue({
      events: [],
      loading: false,
      error: errorMessage,
    });
    render(<CalendarPage />);
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText(/Loading interviews.../i)).not.toBeInTheDocument();
      expect(screen.queryByTestId('simple-schedule')).not.toBeInTheDocument();
    });
  });
});