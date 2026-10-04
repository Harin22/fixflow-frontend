import { useEffect, useState } from "react";

import "./index.css";

import fixflowLogo from "./assets/fix_flow_logo.png";

const API_URL = "http://127.0.0.1:5000";

function Dashboard() {

  const [code, setCode] = useState("");

  const [error, setError] = useState("");

  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [debugCount, setDebugCount] = useState(0);

  const [history, setHistory] = useState([]);

  const [activeView, setActiveView] = useState("debugger");

  const [upgradeLoading, setUpgradeLoading] = useState(false);

  // ---------------------------------------------
  // CHECK LOGIN
  // ---------------------------------------------

  useEffect(() => {

    const token = localStorage.getItem("access_token");

    if (!token) {

      window.location.href = "/login";

      return;
    }

    loadHistory();

  }, []);

  // ---------------------------------------------
  // LOAD HISTORY
  // ---------------------------------------------

  const loadHistory = async () => {

    const token = localStorage.getItem("access_token");

    try {

      const response = await fetch(
        `${API_URL}/api/debug/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {

        localStorage.removeItem("access_token");

        window.location.href = "/login";

        return;
      }

      const data = await response.json();

      if (response.ok) {

        setHistory(data.history || []);

        if (data.history && data.history.length > 0) {

          setDebugCount(data.history.length);

        }
      }

    } catch (err) {

      console.error("History error:", err);

    }

  };

  // ---------------------------------------------
  // ANALYZE CODE
  // ---------------------------------------------

  const handleAnalyze = async () => {

    if (!code.trim()) {

      setMessage("Please enter your code.");

      return;
    }

    if (!error.trim()) {

      setMessage("Please enter the error or traceback.");

      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {

      window.location.href = "/login";

      return;
    }

    setLoading(true);

    setMessage("");

    setAnalysis(null);

    try {

      const response = await fetch(
        `${API_URL}/api/debug`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            code,

            error,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {

        localStorage.removeItem("access_token");

        window.location.href = "/login";

        return;
      }

      if (response.status === 403) {

        setMessage(
          data.error ||
            "Free limit reached. Please upgrade to Pro."
        );

        return;
      }

      if (!response.ok) {

        setMessage(
          data.error ||
            "Something went wrong while analyzing."
        );

        return;
      }

      setAnalysis(data.analysis);

      setDebugCount(data.debug_count || 0);

      await loadHistory();

    } catch (err) {

      console.error(err);

      setMessage(
        "Could not connect to the FixFlow backend."
      );

    } finally {

      setLoading(false);

    }

  };

  // ---------------------------------------------
  // STRIPE UPGRADE
  // ---------------------------------------------

  const handleUpgrade = async () => {

    const token = localStorage.getItem("access_token");

    if (!token) {

      window.location.href = "/login";

      return;
    }

    setUpgradeLoading(true);

    setMessage("");

    try {

      const response = await fetch(
        `${API_URL}/api/stripe/create-checkout`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {

        localStorage.removeItem("access_token");

        window.location.href = "/login";

        return;
      }

      if (!response.ok) {

        setMessage(
          data.error ||
            "Unable to start Stripe Checkout."
        );

        return;
      }

      if (!data.checkout_url) {

        setMessage(
          "Stripe Checkout URL was not returned."
        );

        return;
      }

      window.location.href = data.checkout_url;

    } catch (err) {

      console.error("Stripe error:", err);

      setMessage(
        "Could not connect to Stripe."
      );

    } finally {

      setUpgradeLoading(false);

    }

  };

  // ---------------------------------------------
  // COPY FIXED CODE
  // ---------------------------------------------

  const handleCopy = async () => {

    if (!analysis?.fixed_code) {

      return;
    }

    try {

      await navigator.clipboard.writeText(
        analysis.fixed_code
      );

      setMessage("Fixed code copied.");

    } catch (err) {

      setMessage("Could not copy the code.");

    }

  };

  // ---------------------------------------------
  // LOGOUT
  // ---------------------------------------------

  const handleLogout = () => {

    localStorage.removeItem("access_token");

    window.location.href = "/";

  };

  // ---------------------------------------------
  // LINE NUMBERS
  // ---------------------------------------------

  const codeLines = Math.max(
    code.split("\n").length,
    18
  );

  // ---------------------------------------------
  // DASHBOARD
  // ---------------------------------------------

  return (

    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-brand">

          <img
            src={fixflowLogo}
            alt="FixFlow"
          />

        </div>

        <nav className="dashboard-nav">

          <button
            className={
              activeView === "debugger"
                ? "dashboard-nav-item active"
                : "dashboard-nav-item"
            }

            onClick={() =>
              setActiveView("debugger")
            }
          >

            <span className="nav-icon">
              +
            </span>

            <span>
              New Debug
            </span>

          </button>

          <button
            className={
              activeView === "history"
                ? "dashboard-nav-item active"
                : "dashboard-nav-item"
            }

            onClick={() =>
              setActiveView("history")
            }
          >

            <span className="nav-icon">
              ◷
            </span>

            <span>
              History
            </span>

          </button>

        </nav>

        <div className="dashboard-sidebar-bottom">

          <div className="dashboard-plan">

            <div className="plan-top">

              <span>
                Free Plan
              </span>

              <span>
                {Math.min(debugCount, 3)} / 3
              </span>

            </div>

            <div className="plan-progress">

              <div
                className="plan-progress-fill"
                style={{
                  width: `${Math.min(
                    (debugCount / 3) * 100,
                    100
                  )}%`,
                }}
              />

            </div>

            <button
              className="upgrade-button"
              onClick={handleUpgrade}
              disabled={upgradeLoading}
            >

              {upgradeLoading
                ? "Opening..."
                : "Upgrade to Pro"}

              <span>
                →
              </span>

            </button>

          </div>

          {/* LOGOUT */}

          <button
            className="dashboard-user"
            onClick={handleLogout}
          >

            <div className="dashboard-avatar">
              ↪
            </div>

            <div className="dashboard-user-info">

              <strong>
                Logout
              </strong>

              <span>
                Return to FixFlow
              </span>

            </div>

          </button>

        </div>

      </aside>

      {/* MAIN WORKSPACE */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <span className="dashboard-eyebrow">

              {activeView === "history"
                ? "DEBUG HISTORY"
                : "DEBUGGER"}

            </span>

            <h1>

              {activeView === "history"
                ? "History"
                : "New Debug"}

            </h1>

          </div>

          <div className="dashboard-header-actions">

            <span className="usage-label">

              {Math.max(
                0,
                3 - debugCount
              )}{" "}

              free analyses

            </span>

            <button
              className="header-upgrade"
              onClick={handleUpgrade}
              disabled={upgradeLoading}
            >

              {upgradeLoading
                ? "Opening..."
                : "Upgrade"}

            </button>

          </div>

        </header>

        {/* HISTORY VIEW */}

        {activeView === "history" ? (

          <div className="dashboard-workspace">

            <section
              className="dashboard-panel"
              style={{
                gridColumn: "1 / -1",
              }}
            >

              <div className="dashboard-panel-header">

                <div>

                  <h2>
                    Previous Debugs
                  </h2>

                  <p>
                    Your previous FixFlow analyses.
                  </p>

                </div>

              </div>

              <div
                style={{
                  padding: "24px",
                  overflowY: "auto",
                  maxHeight: "600px",
                }}
              >

                {history.length === 0 ? (

                  <div className="dashboard-analysis-empty">

                    <div className="analysis-empty-mark">
                      ◷
                    </div>

                    <h3>
                      No debug history yet.
                    </h3>

                    <p>
                      Your completed analyses will appear here.
                    </p>

                  </div>

                ) : (

                  history.map((item) => (

                    <div
                      key={item.id}
                      style={{
                        borderBottom:
                          "1px solid rgba(0,0,0,0.06)",

                        padding: "20px 0",

                        cursor: "pointer",
                      }}

                      onClick={() => {

                        setCode(item.code);

                        setError(item.error);

                        setAnalysis({

                          why_it_happened:
                            item.why_it_happened,

                          how_to_fix_it:
                            item.how_to_fix_it,

                          what_you_can_learn:
                            item.what_you_can_learn,

                          fixed_code:
                            item.fixed_code,

                        });

                        setActiveView("debugger");

                      }}
                    >

                      <div
                        style={{
                          fontWeight: 600,
                          marginBottom: "8px",
                        }}
                      >

                        {item.error}

                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#777",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >

                        {item.code}

                      </div>

                    </div>

                  ))

                )}

              </div>

            </section>

          </div>

        ) : (

          <div className="dashboard-workspace">

            {/* CODE PANEL */}

            <section className="dashboard-panel code-workspace">

              <div className="dashboard-panel-header">

                <div>

                  <h2>
                    Your Code
                  </h2>

                  <p>
                    Paste the code causing the problem.
                  </p>

                </div>

                {/* LANGUAGE DROPDOWN */}

                <select
                  className="language-selector"
                  defaultValue="Python"
                  aria-label="Programming language"
                >

                  <option value="Python">
                    Python
                  </option>

                  <option value="C">
                    C
                  </option>

                  <option value="C++">
                    C++
                  </option>

                  <option value="Dart">
                    Dart
                  </option>

                </select>

              </div>

              <div className="dashboard-code-editor">

                <div className="dashboard-line-numbers">

                  {Array.from(
                    {
                      length: codeLines,
                    },

                    (_, index) => (

                      <span key={index}>

                        {String(
                          index + 1
                        ).padStart(2, "0")}

                      </span>

                    )
                  )}

                </div>

                <textarea
                  className="dashboard-code-input"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value)
                  }

                  placeholder={`from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Hello World"}`}

                  spellCheck="false"
                />

              </div>

              <div className="dashboard-error-section">

                <label>
                  Error / Traceback
                </label>

                <textarea
                  className="dashboard-error-input"
                  value={error}
                  onChange={(e) =>
                    setError(e.target.value)
                  }

                  placeholder="Paste the error message or traceback here..."

                  spellCheck="false"
                />

              </div>

              <button
                className="dashboard-analyze-button"
                onClick={handleAnalyze}
                disabled={loading}
              >

                <span className="analyze-spark">

                  {loading
                    ? "◌"
                    : "✦"}

                </span>

                <span>

                  {loading
                    ? "Analyzing..."
                    : "Analyze with AI"}

                </span>

                <span className="analyze-arrow">
                  →
                </span>

              </button>

              {message && (

                <p
                  style={{
                    marginTop: "12px",
                    textAlign: "center",
                    fontSize: "13px",
                    color: "#666",
                  }}
                >

                  {message}

                </p>

              )}

            </section>

            {/* ANALYSIS PANEL */}

            <section className="dashboard-panel analysis-workspace">

              <div className="dashboard-panel-header analysis-panel-header">

                <div className="analysis-heading">

                  <span className="analysis-status-dot" />

                  <div>

                    <h2>
                      FixFlow Analysis
                    </h2>

                    <p>

                      {analysis
                        ? "AI debugging report"
                        : "Your debugging report will appear here."}

                    </p>

                  </div>

                </div>

                {analysis?.fixed_code && (

                  <button
                    className="dashboard-copy-button"
                    onClick={handleCopy}
                  >

                    ⧉ Copy

                  </button>

                )}

              </div>

              {!analysis ? (

                <div className="dashboard-analysis-empty">

                  <div className="analysis-empty-mark">
                    ✦
                  </div>

                  <h3>
                    Ready to debug.
                  </h3>

                  <p>
                    Add your code and error on the left,
                    then analyze it with FixFlow AI.
                  </p>

                  <div className="analysis-empty-hint">

                    <span>
                      1
                    </span>

                    Add code

                    <span>
                      2
                    </span>

                    Add error

                    <span>
                      3
                    </span>

                    Analyze

                  </div>

                </div>

              ) : (

                <div
                  style={{
                    padding: "24px",
                    overflowY: "auto",
                    maxHeight: "650px",
                  }}
                >

                  <div
                    style={{
                      marginBottom: "28px",
                    }}
                  >

                    <h3
                      style={{
                        marginBottom: "8px",
                      }}
                    >
                      Why it happened
                    </h3>

                    <p>
                      {analysis.why_it_happened}
                    </p>

                  </div>

                  <div
                    style={{
                      marginBottom: "28px",
                    }}
                  >

                    <h3
                      style={{
                        marginBottom: "8px",
                      }}
                    >
                      How to fix it
                    </h3>

                    <p>
                      {analysis.how_to_fix_it}
                    </p>

                  </div>

                  <div
                    style={{
                      marginBottom: "28px",
                    }}
                  >

                    <h3
                      style={{
                        marginBottom: "8px",
                      }}
                    >
                      What you can learn
                    </h3>

                    <p>
                      {analysis.what_you_can_learn}
                    </p>

                  </div>

                  <div>

                    <h3
                      style={{
                        marginBottom: "8px",
                      }}
                    >
                      Fixed code
                    </h3>

                    <pre
                      style={{
                        background: "#111",
                        color: "#eee",
                        padding: "18px",
                        borderRadius: "12px",
                        overflowX: "auto",
                        whiteSpace: "pre-wrap",
                        fontSize: "13px",
                        lineHeight: "1.6",
                      }}
                    >

                      {analysis.fixed_code}

                    </pre>

                  </div>

                </div>

              )}

            </section>

          </div>

        )}

        <div className="dashboard-bottom">

          <span>
            FixFlow AI
          </span>

          <span>
            Your code is analyzed securely.
          </span>

        </div>

      </main>

    </div>

  );

}

export default Dashboard;