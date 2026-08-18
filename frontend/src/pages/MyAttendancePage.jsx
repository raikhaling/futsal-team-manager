import { useEffect, useState } from "react";
import playerAttendanceApi from "../api/playerAttendanceApi";

function MyAttendancePage() {
  const [attendance, setAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAttendance() {
      try {
        setLoading(true);
        setError("");

        const [attendanceResponse, historyResponse] = await Promise.all([
          playerAttendanceApi.getMyAttendance(),
          playerAttendanceApi.getMyAttendanceHistory(),
        ]);

        setAttendance(attendanceResponse.data);
        setHistory(historyResponse.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load attendance information.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Loading attendance...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        My Attendance
      </h1>

      {attendance && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Attendance Summary
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Matches
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {attendance.totalMatches}
              </p>
            </div>

            <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Attended
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">
                {attendance.attended}
              </p>
            </div>

            <div className="rounded-lg border border-rose-100 bg-rose-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Missed
              </p>
              <p className="mt-1 text-2xl font-bold text-rose-700">
                {attendance.missed}
              </p>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Attendance Rate
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-700">
                {attendance.attendancePercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Attendance History
          </h2>
        </div>

        {history.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No attendance history available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Start Time</th>
                  <th className="px-6 py-3 font-semibold">End Time</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {history.map((match) => (
                  <tr
                    key={match.matchId}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {match.matchDate}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {match.startTime}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {match.endTime}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          match.status === "ATTENDED"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : match.status === "NO_SHOW" ||
                                match.status === "MISSED"
                              ? "border-rose-200 bg-rose-50 text-rose-700"
                              : "border-slate-200 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {match.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default MyAttendancePage;
