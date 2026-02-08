import { useState } from "react";

const themes = {
  purple: {
    bg: "linear-gradient(135deg, #667eea, #764ba2)",
    accent: "#764ba2"
  },
  blue: {
    bg: "linear-gradient(135deg, #2193b0, #6dd5ed)",
    accent: "#2193b0"
  },
  sunset: {
    bg: "linear-gradient(135deg, #ff512f, #dd2476)",
    accent: "#dd2476"
  }
};

function App() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("purple");

  const analyzeText = async () => {
    if (!text.trim()) {
      setError("Text cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Something went wrong");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`app ${darkMode ? "dark" : ""}`}
      style={{ background: themes[theme].bg }}
    >
      <div className="container">
        <header>
          <h1> VibeCheck</h1>

          <div className="controls">
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="purple">Purple</option>
              <option value="blue">Blue</option>
              <option value="sunset">Sunset</option>
            </select>
          </div>
        </header>

        <textarea
          placeholder="Paste your task or message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={analyzeText} disabled={loading}>
          {loading ? "Analyzing vibes..." : "Analyze"}
        </button>

        {error && <p className="error">❌ {error}</p>}

        {analysis && (
          <div className="result animate">
            <h3>Summary</h3>
            <p>{analysis.summary}</p>

            <h3>Tone</h3>
            <p>{analysis.tone}</p>

            <h3>Urgency</h3>
            <div className={`urgency level-${analysis.urgency}`}>
              Level {analysis.urgency}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
