import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <main>
      <h1>Login</h1>
      <p>Please log in to manage your futsal activities.</p>

      <Link to="/">Back to Home</Link>
    </main>
  );
}

export default LoginPage;
