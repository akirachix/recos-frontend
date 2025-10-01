import { useState, useEffect } from "react";
import { useToken } from "./useToken";
import { Event } from "../calendar/components/Calendar";
import { fetchInterviews } from "../utils/fetchInterview";

interface InterviewItem {
  id?: number;
  candidate_id?: number;
  scheduled_at: string;
  created_at?: string;
}
export function useFetchInterviews() {
  const token = useToken();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        setError("Please log in to view your interviews.");
        setEvents([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data: InterviewItem[] = await fetchInterviews(token);
        const mappedEvents = data.map((item) => ({
          id: item.id || item.candidate_id || 0,
          date: item.scheduled_at,
          label: "Interview",
          created_at: item.created_at,
        }));
        setEvents(mappedEvents);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  return { events, loading, error };
}
