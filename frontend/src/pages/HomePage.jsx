import { useAuth } from "../context/useAuth";

function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Futsal Team Manager</h1>

      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

export default HomePage;
