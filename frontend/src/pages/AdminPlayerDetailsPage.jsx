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

                console.log("Player:", response.data);

                setPlayer(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to load player.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadPlayer();
    }, [id]);

    if (loading) {
        return <p>Loading player...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <section>
            <h1>Player Details</h1>

            <p>
                <strong>ID:</strong> {player.id}
            </p>

            <p>
                <strong>Name:</strong> {player.name}
            </p>

            <p>
                <strong>Email:</strong> {player.email}
            </p>

            <p>
                <strong>Phone:</strong> {player.phone || "-"}
            </p>

            <p>
                <strong>Preferred Position:</strong>{" "}
                {player.preferredPosition}
            </p>

            <p>
                <strong>Jersey Number:</strong>{" "}
                {player.jerseyNumber ?? "-"}
            </p>

            <p>
                <strong>Role:</strong> {player.role}
            </p>

            <Link to="/admin/players">Back to Players</Link>
        </section>
    );
}

export default AdminPlayerDetailsPage;