import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminPlayerApi from "../api/adminPlayerApi";

function AdminEditPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredPosition: "",
    jerseyNumber: "",
    systemRole: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlayer() {
      try {
        setLoading(true);
        setError("");

        const response = await adminPlayerApi.getPlayerById(id);
        const player = response.data;

        setFormData({
          name: player.name ?? "",
          email: player.email ?? "",
          phone: player.phone ?? "",
          preferredPosition: player.preferredPosition ?? "",
          jerseyNumber: player.jerseyNumber ?? "",
          systemRole: player.systemRole ?? "",
        });
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load player.");
      } finally {
        setLoading(false);
      }
    }

    loadPlayer();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const updateData = {
        ...formData,
        jerseyNumber:
          formData.jerseyNumber === "" ? null : Number(formData.jerseyNumber),
      };

      await adminPlayerApi.updatePlayer(id, updateData);

      navigate(`/admin/players/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update player.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading player...</p>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-2xl py-4 sm:py-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Edit Player
        </h1>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-700"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="preferredPosition"
              className="block text-sm font-medium text-slate-700"
            >
              Preferred Position
            </label>

            <select
              id="preferredPosition"
              name="preferredPosition"
              value={formData.preferredPosition}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select position</option>
              <option value="GOALKEEPER">Goalkeeper</option>
              <option value="DEFENDER">Defender</option>
              <option value="MIDFIELDER">Midfielder</option>
              <option value="FORWARD">Forward</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="jerseyNumber"
              className="block text-sm font-medium text-slate-700"
            >
              Jersey Number
            </label>
            <input
              id="jerseyNumber"
              name="jerseyNumber"
              type="number"
              value={formData.jerseyNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="systemRole"
              className="block text-sm font-medium text-slate-700"
            >
              Role
            </label>

            <select
              id="role"
              name="systemRole"
              value={formData.systemRole}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select role</option>
              <option value="USER">User</option>
              <option value="SYSTEM_ADMIN">System admin</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Player"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/admin/players/${id}`)}
              disabled={submitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AdminEditPlayerPage;
