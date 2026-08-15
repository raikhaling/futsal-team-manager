import { useAuth } from "../context/useAuth";

function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Checking session...</p>;
  }

  return (
    <div>
      <h1>Futsal Team Manager</h1>

      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default HomePage;
