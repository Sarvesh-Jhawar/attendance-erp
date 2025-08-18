import React from "react";
import Link from "next/link";

// Helper to convert "DD-MM-YYYY" to Date object
function parseDate(dateStr: string) {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const holidays = [
  { occasion: "Janmastami", date: "16-08-2025", day: "Saturday" },
  { occasion: "Vinayaka Chavithi", date: "27-08-2025", day: "Wednesday" },
  { occasion: "Eid Miladun Nabi", date: "05-09-2025", day: "Friday" },
  { occasion: "Bathukamma Starting Day", date: "21-09-2025", day: "Sunday" },
  { occasion: "Mahatma Gandhi Jayanthi / Vijaya Dasami", date: "02-10-2025", day: "Thursday" },
  { occasion: "Following Day of Vijaya Dasami", date: "03-10-2025", day: "Friday" },
  { occasion: "Deepavali", date: "20-10-2025", day: "Monday" },
  { occasion: "Kartika Purnima / Guru Nanak's Birthday", date: "05-11-2025", day: "Wednesday" },
  { occasion: "Christmas", date: "25-12-2025", day: "Thursday" },
  { occasion: "Following Day of Christmas (Boxing Day)", date: "26-12-2025", day: "Friday" },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingHolidays = holidays.filter(
  (holiday) => parseDate(holiday.date) >= today
);

export default function HolidaysPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #2a0845 0%, #6441a5 100%)",
        color: "#fff",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center px-4 py-4 sm:px-8"
        style={{
          background: "linear-gradient(90deg, #18132a 0%, #3a206b 100%)",
          borderBottom: "1.5px solid #6441a5",
        }}
      >
        <Link
          href="/dashboard"
          className="flex items-center font-medium text-white text-base sm:text-lg"
          style={{ textDecoration: "none" }}
        >
          <span className="flex items-center mr-2">
            {/* Left arrow icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: "0.2rem" }}>
              <path d="M15 19l-7-7 7-7" stroke="#8ab4f8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </span>
        </Link>
        <span
          className="ml-4 text-xl sm:text-3xl font-bold"
          style={{
            letterSpacing: "1px",
            background: "linear-gradient(90deg, #5ea2ef 0%, #b57aff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Upcoming Holidays
        </span>
      </div>

      {/* Responsive Table */}
      <div className="px-2 py-6 sm:px-8">
        <div className="overflow-x-auto rounded-xl shadow-lg" style={{ background: "rgba(44, 19, 56, 0.85)" }}>
          <table className="min-w-[500px] w-full text-left">
            <thead>
              <tr>
                <th
                  className="px-4 py-3 text-white font-semibold text-base sm:text-lg whitespace-nowrap"
                  style={{
                    border: "1px solid #6441a5",
                    background: "rgba(100,65,165,0.9)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Date
                </th>
                <th
                  className="px-4 py-3 text-white font-semibold text-base sm:text-lg"
                  style={{
                    border: "1px solid #6441a5",
                    background: "rgba(100,65,165,0.9)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Occasion
                </th>
                <th
                  className="px-4 py-3 text-white font-semibold text-base sm:text-lg"
                  style={{
                    border: "1px solid #6441a5",
                    background: "rgba(100,65,165,0.9)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Day
                </th>
              </tr>
            </thead>
            <tbody>
              {upcomingHolidays.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-white text-base"
                    style={{
                      background: "rgba(44, 19, 56, 0.7)",
                      border: "1px solid #6441a5",
                    }}
                  >
                    No upcoming holidays
                  </td>
                </tr>
              ) : (
                upcomingHolidays.map((holiday, idx) => (
                  <tr key={idx}>
                    <td
                      className="px-4 py-3 text-white text-sm sm:text-base whitespace-nowrap"
                      style={{
                        border: "1px solid #6441a5",
                      }}
                    >
                      {holiday.date}
                    </td>
                    <td
                      className="px-4 py-3 text-white text-sm sm:text-base"
                      style={{
                        border: "1px solid #6441a5",
                      }}
                    >
                      {holiday.occasion}
                    </td>
                    <td
                      className="px-4 py-3 text-white text-sm sm:text-base"
                      style={{
                        border: "1px solid #6441a5",
                      }}
                    >
                      {holiday.day}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}