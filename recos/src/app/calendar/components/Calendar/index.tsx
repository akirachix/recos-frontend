"use client";

import React, { useState } from "react";
import { useCreateInterview } from "@/app/hooks/useCreateInterview";

export type Event = {
  id: number;
  date: string;
  label: string;
  created_at?: string;
};

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface SimpleScheduleProps {
  initialYear: number;
  initialMonth: number;
  events: Event[];
  onEditInterview: (id: number) => void;
  onCreateInterviewClick: (dateStr: string) => void;
}
export default function SimpleSchedule({
  initialYear,
  initialMonth,
  events,
  onEditInterview,
  onCreateInterviewClick,
}: SimpleScheduleProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const { loading } = useCreateInterview();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const normalizeDateToLocal = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const mm = month < 10 ? "0" + month : month.toString();
    const dd = day < 10 ? "0" + day : day.toString();
    return `${year}-${mm}-${dd}`;
  };

  const uniqueEvents = (events: Event[]) => {
    const seen = new Set<string>();
    return events.filter((ev) => {
      const key = ev.id + "_" + normalizeDateToLocal(ev.date);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  const previousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };
  const currentMonthDateStr = (day: number) => {
    const mm = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dd = day < 10 ? `0${day}` : `${day}`;
    return `${year}-${mm}-${dd}`;
  };
  const onDayClick = (day: number) => {
    if (loading) return;
    const dateStr = currentMonthDateStr(day);
    onCreateInterviewClick(dateStr);
  };
  const firstDayIndex = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  return (
    <div className="bg-white p-14 gap-10 rounded shadow overflow-hidden max-w-full text-2xl">
      <div className="flex items-center mb-4 space-x-4">
        <button onClick={previousMonth} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">
          &lt;
        </button>
        <div className="font-semibold">{new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })}</div>
        <button onClick={nextMonth} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs sm:text-sm md:text-base text-gray-600 font-semibold select-none">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-purple-200 rounded-full py-1 sm:py-2 text-purple-800 truncate"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-2xl">
        {[...Array(firstDayIndex)].map((_, i) => (
          <div key={`empty-start-${i}`} />
        ))}

        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const dateStr = currentMonthDateStr(day);
          const dayEventsRaw = events.filter((ev) => normalizeDateToLocal(ev.date) === dateStr);
          const dayEvents = uniqueEvents(dayEventsRaw);

          const dayClassNames = `h-20 border rounded p-4 flex flex-col justify-between cursor-pointer  shadow-md  ${dayEvents.length > 0 ? "bg-purple-100 border-white shadow-md" : "border-gray-300"
            }`;

          return (
            <div
              key={day}
              className={dayClassNames}
              onClick={() => onDayClick(day)}
              title="Click to create interview"
            >
              <div className="text-lg font-semibold">{day}</div>
              {dayEvents.map((ev, idx) => (
                <div
                  key={`${day}-${ev.id}-${ev.created_at || idx}`}
                  className=" rounded text-sm flex gap-2 items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditInterview(ev.id);
                  }}
                >
                  <span
                    className="text-purple-700 underline"
                    role="link"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && onEditInterview(ev.id)}
                  >
                    Interview
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {loading && <div>Creating interview...</div>}
    </div>
  );
}
