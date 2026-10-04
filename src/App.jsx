import { useEffect, useState } from "react"

import "./index.css"

import fixflowLogo from "./assets/fix_flow_logo.png"

import Auth from "./Auth"
import Signup from "./Signup"
import Login from "./Login"
import Dashboard from "./Dashboard"


// =========================================================
// LINKS
// =========================================================

const GITHUB_URL = "https://github.com/Harin22/fixflow-backend"
const LINKEDIN_URL = "https://www.linkedin.com/"


// =========================================================
// DEMO CODE
// =========================================================

const codeLines = [
  "from fastapi import FastAPI, Depends",
  "from sqlalchemy.orm import Session",
  "from app.models import User",
  "from app.database import get_db",
  "from app.services.ai import analyze_error",
  "",
  "app = FastAPI()",
  "",
  "@app.post('/api/debug')",
  "async def debug_code(",
  "    code: str,",
  "    error: str,",
  "    db: Session = Depends(get_db)",
  "):",
  "    try:",
  "        result = analyze_error(code, error)",
  "        return {",
  '            "root_cause": result.root_cause,',
  '            "suggested_fix": result.fix,',
  '            "confidence": result.confidence',
  "        }",
  "    except Exception as e:",
  "        raise HTTPException(",
  "            status_code=500,",
  "            detail=str(e)",
  "        )",
]


// =========================================================
// FIXFLOW ANALYSIS
// =========================================================

const analysisSections = [
  {
    title: "Root Cause",
    lead: "What actually broke, and where.",
    points: [
      "What actually caused the failure",
      "Which function, file and line is responsible",
      "The full chain of failure when several things are involved",
    ],
  },

  {
    title: "How to Fix",
    lead: "The exact change, and why it works.",
    points: [
      "The exact change needed",
      "A corrected implementation",
      "Why that change solves the problem",
    ],
  },

  {
    title: "Fixed Code",
    lead: "The complete file, not a single line.",
    points: [
      "The full corrected code, ready to copy",
      "Not just a one-line patch",
    ],
  },

  {
    title: "What You Can Learn",
    lead: "Turn every bug into a lesson.",
    points: [
      "The programming concept involved",
      "Why this mistake happens",
      "How to avoid it next time",
    ],
  },

  {
    title: "Error Classification",
    lead: "Every error gets a label, so you know where to look.",
    chips: [
      "Syntax error",
      "Runtime error",
      "Type error",
      "Logic bug",
      "API / integration issue",
      "Database issue",
      "Dependency / environment issue",
      "Authentication issue",
      "Configuration issue",
    ],
    highlight: 5,
    note: "The demo error above is a Database issue.",
  },

  {
    title: "Deeper Code Issues",
    lead: "Problems beyond the error you pasted.",
    chips: [
      "Potential bugs",
      "Bad error handling",
      "Security problems",
      "Inefficient code",
      "Incorrect API usage",
      "Missing validation",
      "Maintainability issues",
    ],
  },

  {
    title: "Suggested Tests",
    lead: "Short checks to confirm the fix.",
    points: [
      "Tests to run to verify the fix",
      "Edge cases worth trying",
      "Quick checks that nothing else broke",
    ],
  },
]


// =========================================================
// APP ROUTER
// =========================================================

function App() {
  const path = window.location.pathname

  if (path === "/auth") {
    return <Auth />
  }

  if (path === "/signup") {
    return <Signup />
  }

  if (path === "/login") {
    return <Login />
  }

  if (path === "/dashboard") {
    return <Dashboard />
  }

  return <Landing />
}


// =========================================================
// LANDING PAGE
// =========================================================

function Landing() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [activeReport, setActiveReport] = useState(0)


  useEffect(() => {
    let index = 0

    const timer = setInterval(() => {
      index += 1
      setVisibleLines(index)

      if (index >= codeLines.length) {
        clearInterval(timer)

        setTimeout(() => {
          setVisibleLines(0)
        }, 5000)
      }
    }, 65)

    return () => clearInterval(timer)
  }, [visibleLines === codeLines.length])


  const goToAuth = () => {
    window.location.href = "/auth"
  }


  const restartTyping = () => {
    setVisibleLines(0)
  }


  const report = analysisSections[activeReport]


  return (
    <div className="site">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar">

        <a href="/" className="brand">
          <img
            src={fixflowLogo}
            alt="FixFlow"
          />
        </a>


        <div className="nav-links">

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="github-link"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.77 1.04.77 2.1v3.12c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
            </svg>

            <span>GitHub</span>
          </a>

        </div>

      </header>


      <main>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="hero">

          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
          <div className="cloud cloud-three" />


          {/* HERO CONTENT */}

          <div className="hero-content">

            <h1>
              The only tool
              <br />
              <em>Vibe coders</em>
              <br />
              will ever need!
            </h1>

            <p className="hero-description">
              FixFlow analyzes your errors, explains the root cause,
              and helps you fix them with a highly trained coding LLM.
            </p>


            <div className="hero-checks">

              <div>
                <span>✓</span>
                Explain errors
              </div>

              <div>
                <span>✓</span>
                Suggest fixes
              </div>

              <div>
                <span>✓</span>
                Gives quality code
              </div>

              <div>
                <span>✓</span>
                Learn as you go
              </div>

            </div>

          </div>


          {/* GET STARTED */}

          <div className="hero-auth">

            <h2>
              Start debugging
            </h2>

            <p>
              Sign in to save your fixes, or log in to pick up
              where you left off.
            </p>


            <div className="hero-auth-actions">

              <button
                className="hero-signin"
                onClick={goToAuth}
              >
                Get started
              </button>

            </div>

          </div>


          {/* SCROLL */}

          <a
            href="#product"
            className="scroll-cue"
            aria-label="Scroll down"
          >
            <span>
              Scroll
            </span>

            <i />
          </a>

        </section>


        {/* =====================================================
            PRODUCT MOCKUP
        ===================================================== */}

        <section
          id="product"
          className="product-section"
        >

          <div className="browser">

            {/* BROWSER BAR */}

            <div className="browser-bar">

              <div className="traffic-lights">
                <i />
                <i />
                <i />
              </div>

              <div className="browser-address">
                app.fixflow.dev
              </div>

              <div />

            </div>


            {/* APPLICATION */}

            <div className="app-window">


              {/* SIDEBAR */}

              <aside className="sidebar">

                <div className="sidebar-logo">
                  Fix<span>Flow</span>
                </div>


                <div className="sidebar-nav">

                  <button className="active">
                    <b>+</b>
                    New Chat
                  </button>

                  <button>
                    <span>◷</span>
                    History
                  </button>

                  <button>
                    <span>♧</span>
                    Snippets
                  </button>

                  <button>
                    <span>⚙</span>
                    Settings
                  </button>

                </div>


                <div className="profile">

                  <div className="avatar">
                    H
                  </div>

                  <div>
                    <strong>
                      Harin
                    </strong>

                    <small>
                      Free Plan
                    </small>
                  </div>

                  <span className="chevron">
                    ⌄
                  </span>

                </div>

              </aside>


              {/* CODE PANEL */}

              <div className="code-column">

                <div className="panel-header">

                  <strong>
                    Your Code
                  </strong>

                  <button className="language">
                    <span />
                    Python
                    <span>⌄</span>
                  </button>

                </div>


                <div
                  className="code-editor"
                  onClick={restartTyping}
                  title="Click to replay"
                >

                  <div className="line-numbers">

                    {codeLines.map((_, index) => (
                      <div key={index}>
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    ))}

                  </div>


                  <pre>

                    {codeLines.map((line, index) => (
                      <div
                        key={index}
                        className={
                          index < visibleLines
                            ? "code-line visible"
                            : "code-line"
                        }
                      >
                        {highlightCode(line)}
                      </div>
                    ))}

                    <span className="typing-cursor" />

                  </pre>

                </div>


                <button
                  className="analyze-button"
                  onClick={goToAuth}
                >

                  <span>✦</span>

                  Analyze with AI

                  <b>→</b>

                </button>

              </div>


              {/* ANALYSIS PANEL */}

              <div className="analysis-column">

                <div className="panel-header">

                  <div className="analysis-title">
                    <span className="analysis-dot" />
                    FixFlow Analysis
                  </div>

                  <button className="copy-button">
                    ⧉ Copy
                  </button>

                </div>


                <div className="error-box">

                  <div className="error-icon">
                    !
                  </div>

                  <div>

                    <strong>
                      RuntimeError
                    </strong>

                    <small>
                      Failed to initialize database connection.
                    </small>

                  </div>

                </div>


                <div className="analysis-block">

                  <h3>
                    Why this happens?
                  </h3>

                  <p>
                    The database connection is failing because the
                    application is trying to connect using invalid
                    credentials or the database is not reachable from
                    the current environment.
                  </p>

                </div>


                <div className="analysis-block">

                  <h3>
                    How to fix it?
                  </h3>

                  <div className="tabs">

                    <button className="selected">
                      Suggested Fix
                    </button>

                    <button>
                      Explanation
                    </button>

                    <button>
                      Related Files
                    </button>

                  </div>


                  <div className="fix-editor">

                    <div className="fix-top">

                      <span>
                        database.py
                      </span>

                      <button>
                        ⧉ Copy
                      </button>

                    </div>


                    <pre>
{`from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)`}
                    </pre>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FIXFLOW ANALYSIS REPORT
        ===================================================== */}

        <section
          id="analysis"
          className="analysis-section"
        >

          <div className="analysis-head">

            <h2>
              FixFlow Analysis
            </h2>

            <p>
              Every error you paste comes back as one structured
              report. Pick a section to see what's inside.
            </p>

          </div>


          <div className="report">

            <div className="report-tabs">

              {analysisSections.map((section, index) => (

                <button
                  key={section.title}
                  className={
                    index === activeReport
                      ? "report-tab selected"
                      : "report-tab"
                  }
                  aria-current={
                    index === activeReport
                      ? "true"
                      : undefined
                  }
                  onClick={() => setActiveReport(index)}
                >

                  <span className="report-tab-index">
                    {index + 1}
                  </span>

                  {section.title}

                </button>

              ))}

            </div>


            <div
              className="report-body"
              aria-live="polite"
            >

              <div
                className="report-panel"
                key={activeReport}
              >

                <div
                  className="report-watermark"
                  aria-hidden="true"
                >
                  {String(activeReport + 1).padStart(2, "0")}
                </div>


                <h3>
                  {report.title}
                </h3>

                <p className="report-lead">
                  {report.lead}
                </p>


                {report.points && (

                  <ul className="report-points">

                    {report.points.map((point) => (

                      <li key={point}>

                        <span>
                          ✓
                        </span>

                        {point}

                      </li>

                    ))}

                  </ul>

                )}


                {report.chips && (

                  <div className="report-chips">

                    {report.chips.map((chip, index) => (

                      <span
                        key={chip}
                        className={
                          index === report.highlight
                            ? "chip hit"
                            : "chip"
                        }
                      >
                        {chip}
                      </span>

                    ))}

                  </div>

                )}


                {report.note && (

                  <p className="report-note">
                    {report.note}
                  </p>

                )}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            LINKS + POWERED BY
        ===================================================== */}

        <section
          id="links"
          className="final-section"
        >

          <div className="final-label">
            DEBUG · LEARN · SHIP
          </div>

          <h2>
            From errors to{" "}
            <em>
              breakthroughs.
            </em>
          </h2>

          <p>
            FixFlow isn't just a debugger. It's your coding companion.
          </p>


          <div className="link-row">

            <a
              className="link-card"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >

              <span className="link-icon">
                <GitHubIcon />
              </span>

              <span className="link-text">

                <strong>
                  GitHub
                </strong>

                <small>
                  Harin22/fixflow-backend
                </small>

              </span>

            </a>


            <a
              className="link-card"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
            >

              <span className="link-icon">
                <LinkedInIcon />
              </span>

              <span className="link-text">

                <strong>
                  LinkedIn
                </strong>

                <small>
                  Connect with Harin
                </small>

              </span>

            </a>

          </div>


          <div className="powered">
            <i />
            Powered by LLM
          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer>

        <div className="footer-inner">

          <div className="brand footer-brand">

            <span className="brand-mark">
              <span />
              <span />
              <span />
            </span>

            <span>
              Fix<span>Flow</span>
            </span>

          </div>

          <span>
            © 2026 FixFlow
          </span>

        </div>

      </footer>


      <div className="grain" />

    </div>
  )
}


// =========================================================
// ICONS
// =========================================================

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}


function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}


// =========================================================
// CODE HIGHLIGHTING
// =========================================================

function highlightCode(line) {
  if (!line) {
    return "\u00A0"
  }

  const parts = line.split(
    /(\b(?:from|import|def|async|await|return|try|except|raise|in|if|as)\b|"[^"]*"|'[^']*'|\b\d+\b|#.*)/
  )

  return parts.map((part, index) => {

    if (
      /^(from|import|def|async|await|return|try|except|raise|in|if|as)$/.test(
        part
      )
    ) {
      return (
        <span
          className="token-keyword"
          key={index}
        >
          {part}
        </span>
      )
    }


    if (/^["'].*["']$/.test(part)) {
      return (
        <span
          className="token-string"
          key={index}
        >
          {part}
        </span>
      )
    }


    if (/^\d+$/.test(part)) {
      return (
        <span
          className="token-number"
          key={index}
        >
          {part}
        </span>
      )
    }


    if (part.startsWith("#")) {
      return (
        <span
          className="token-comment"
          key={index}
        >
          {part}
        </span>
      )
    }


    return (
      <span key={index}>
        {part}
      </span>
    )
  })
}


export default App