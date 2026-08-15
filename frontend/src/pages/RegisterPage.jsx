import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    preferredPosition: "GOALKEEPER",
    jerseyNumber: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        preferredPosition: formData.preferredPosition,
        jerseyNumber: formData.jerseyNumber
          ? Number(formData.jerseyNumber)
          : null,
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength="100"
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            maxLength="100"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            minLength="8"
            maxLength="100"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength="8"
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            maxLength="20"
          />
        </div>

        <div>
          <label htmlFor="preferredPosition">Preferred Position</label>

          <select
            id="preferredPosition"
            name="preferredPosition"
            value={formData.preferredPosition}
            onChange={handleChange}
            required
          >
            <option value="GOALKEEPER">Goalkeeper</option>
            <option value="DEFENDER">Defender</option>
            <option value="MIDFIELDER">Midfielder</option>
            <option value="FORWARD">Forward</option>
          </select>
        </div>

        <div>
          <label htmlFor="jerseyNumber">Preferred Jersey Number</label>
          <input
            id="jerseyNumber"
            name="jerseyNumber"
            type="number"
            value={formData.jerseyNumber}
            onChange={handleChange}
          />
        </div>

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default RegisterPage;
