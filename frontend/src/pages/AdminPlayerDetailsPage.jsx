import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import adminPlayerApi from "../api/adminPlayerApi";

function AdminPlayerDetailsPage() {
  const { id } = useParams();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlayer() {
      try {
        const response = await adminPlayerApi.getPlayerById(id);

        setPlayer(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load player.");
      } finally {
        setLoading(false);
      }
    }

    loadPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading player...</p>
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
    <section className="mx-auto max-w-2xl space-y-6 py-4 sm:py-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Player Details
          </h1>

          <Link
            to="/admin/players"
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Players
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              ID
            </span>
            <p className="mt-1 font-mono text-sm text-slate-900">{player.id}</p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Name
            </span>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {player.name}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email
            </span>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {player.email}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Phone
            </span>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {player.phone || "-"}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Preferred Position
            </span>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {player.preferredPosition}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Jersey Number
            </span>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {player.jerseyNumber ?? "-"}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Role
            </span>
            <p className="mt-1">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {player.systemRole}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 pt-2">
          <Link
            to="/admin/players"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to Players
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AdminPlayerDetailsPage;
