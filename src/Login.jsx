import { useState } from "react";
import "./index.css";
import fixflowLogo from "./assets/fix_flow_logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Invalid email or password.");
        return;
      }

      // Save JWT for authenticated requests
      localStorage.setItem("access_token", data.access_token);

      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);

    } catch (error) {
      setMessage("Could not connect to FixFlow.");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <img
          src={fixflowLogo}
          alt="FixFlow"
          className="auth-logo"
        />

        <h1>Welcome back.</h1>

        <p>
          Log in to continue debugging with FixFlow.
        </p>

        <form
          onSubmit={handleLogin}
          className="auth-form"
        >

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="auth-login"
          >
            Log in
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <button
          className="auth-back"
          onClick={() => (window.location.href = "/auth")}
        >
          ← Back
        </button>

      </div>

    </div>
  );
}

export default Login;