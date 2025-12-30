import { useState } from 'react';
import './App.css';

function App() {
  // 1. State variables (like "containers" to hold data)
  const [userInput, setUserInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Function called when the button is clicked
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // This talks to your Python Backend!
      const response = await fetch('https://medflow-nexus01.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userInput }),
      });

      const data = await response.json();
      setResults(data); // Save the answer into our "results" container
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Failed to connect to the backend. Is it running?");
    }
    setLoading(false);
  };

  // 3. The HTML that gets drawn on the screen
  return (
    <div className="dashboard-container">
      <h1>🏥 MedFlow Nexus Dashboard</h1>

      {/* Input Section */}
      <div className="input-section">
        <h3>New Inventory Request</h3>
        <textarea 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="E.g., We urgently need 200 boxes of nitrile gloves for the ER."
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Processing Agents...' : 'Submit Request'}
        </button>
      </div>

      {/* Results Section - Only shows if we have results */}
      {results && (
        <div className="results-section">
          <div className="agent-box sourcing">
            <h3>📦 Sourcing Agent</h3>
            <pre>{results.sourcing_report}</pre>
          </div>
          <div className="agent-box compliance">
            <h3>🛡️ Compliance Agent</h3>
            <pre>{results.compliance_check}</pre>
          </div>
          <div className="agent-box liaison">
            <h3>🗣️ Liaison Agent</h3>
            <pre>{results.doctor_memo}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
