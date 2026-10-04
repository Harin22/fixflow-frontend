import { useState } from "react";
import "./index.css";
import fixflowLogo from "./assets/fix_flow_logo.png";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setMessage("Account created! Redirecting...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

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

        <h1>Create account.</h1>

        <p>
          Start debugging smarter with FixFlow.
        </p>

        <form onSubmit={handleSignup} className="auth-form">

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
            className="auth-signup"
          >
            Create account
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

export default Signup;