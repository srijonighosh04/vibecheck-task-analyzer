import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        headers: {
          "Content-Type": "application/json"
        },
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
    <div className="container">
      <h1>🧠 VibeCheck Task Analyzer</h1>

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
        <div className="result">
          <h3>Summary</h3>
          <p>{analysis.summary}</p>

          <h3>Tone</h3>
          <p>{analysis.tone}</p>

          <h3>Urgency</h3>
          <p>{"🔥".repeat(analysis.urgency)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
