// import { useState, useEffect } from "react";
// import { useToken } from "./useToken";
// import { Event } from "../calendar/components/Calendar";
// import { fetchInterviews } from "../utils/fetchInterview";

// interface InterviewItem {
//   id?: number;
//   candidate_id?: number;
//   candidate_name?: string;
//   candidate_email?: string;
//   scheduled_at: string;
//   created_at?: string;
//   title?: string;
//   description?: string;
//   duration?: number;
//   status?: string;
//   interview_link?: string;
//   google_calendar_link?: string;
//   calendar_event?: {
//     event_id: string;
//     meet_link: string;
//     calendar_link: string;
//     ai_join_url?: string;
//   };
// }

// export function useFetchInterviews() {
//   const token = useToken();
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const refetch = async () => {
//     if (!token) {
//       setEvents([]);
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       const data: InterviewItem[] = await fetchInterviews(token);
//       const mappedEvents: Event[] = data.map((item) => ({
//         id: item.id || item.candidate_id || 0,
//         date: item.scheduled_at,
//         scheduled_at: item.scheduled_at,
//         label: item.title || "Interview",
//         candidate_name: item.candidate_name || "", 
//         candidate_email: item.candidate_email || "", 
//         description: item.description,
//         duration: item.duration,
//         status: item.status,
//         interview_link: item.interview_link,
//         google_calendar_link: item.google_calendar_link,
//         calendar_event: item.calendar_event,
//         created_at: item.created_at,
//         position: item.title || "",
//       }));
//       setEvents(mappedEvents);
//     } catch (error) {
//       setError((error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refetch();
//   }, [token]);

//   return { events, loading, error, refetch };
// }

import { useState, useEffect } from "react";
import { useToken } from "./useToken";
import { Event } from "../calendar/components/Calendar";
import { fetchInterviews } from "../utils/fetchInterview";

interface InterviewItem {
  id?: number;
  candidate_id?: number;
  candidate_name?: string;
  candidate_email?: string;
  scheduled_at: string;
  created_at?: string;
  title?: string;
  description?: string;
  duration?: number;
  status?: string;
  interview_link?: string;
  google_calendar_link?: string;
  calendar_event?: {
    event_id: string;
    meet_link: string;
    calendar_link: string;
    ai_join_url?: string;
  };
}

export function useFetchInterviews() {
  const token = useToken();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    if (!token) {
      setEvents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data: InterviewItem[] = await fetchInterviews(token);
      const mappedEvents: Event[] = data.map((item) => ({
        id: item.id || item.candidate_id || 0,
        date: item.scheduled_at,
        scheduled_at: item.scheduled_at,
        label: item.title || "Interview",
        candidate_name: item.candidate_name || "",
        candidate_email: item.candidate_email || "",
        description: item.description,
        duration: item.duration,
        status: item.status,
        interview_link: item.interview_link,
        google_calendar_link: item.google_calendar_link,
        calendar_event: item.calendar_event,
        created_at: item.created_at,
        position: item.title || "",
      }));
      setEvents(mappedEvents);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [token, refetch]);

  return { events, loading, error, refetch };
}