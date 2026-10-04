function Auth() {
  const goTo = (path) => {
    window.location.href = path;
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <img
          src="/src/assets/fix_flow_logo.png"
          alt="FixFlow"
          className="auth-logo"
        />

        <h1>Start debugging.</h1>

        <p>
          Sign up to start fixing your code,
          or log in to continue where you left off.
        </p>

        <div className="auth-actions">
          <button
            className="auth-signup"
            onClick={() => goTo("/signup")}
          >
            Sign up
          </button>

          <button
            className="auth-login"
            onClick={() => goTo("/login")}
          >
            Log in
          </button>
        </div>

        <button
          className="auth-back"
          onClick={() => goTo("/")}
        >
          ← Back
        </button>

      </div>
    </div>
  );
}

export default Auth;