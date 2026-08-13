import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main>
      <h1>Futsal Team Manager</h1>
      <p>Welcome to the application.</p>

      <Link to="/login">Go to Login</Link>
    </main>
  );
}

export default HomePage;
