import React, { useState } from "react";
import { Send } from "lucide-react";

interface ProcessedData {
  alphabets?: string[];
  numbers?: string[];
  highestAlphabet?: string;
}

const API_URL = "https://22bcs10269-bajaj-backend.57prince23.workers.dev/bfhl";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [apiResponse, setApiResponse] = useState<ProcessedData | null>(null);

  // Function to send a GET request
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setError("Failed to fetch data from the backend");
    }
  };

  // Function to send a POST request
  const validateAndProcessJson = async () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        throw new Error('Input must contain a "data" array');
      }
      setError("");

      // Sending POST request
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedJson),
      });

      const result = await response.json();
      setProcessedData(result);
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">JSON Processor</h1>
          <p className="text-gray-600 mt-2">Enter JSON data to process</p>
        </div>

        <div className="space-y-4">
          <div>
            <textarea
              className={`w-full h-24 p-3 rounded-lg border ${
                error ? "border-red-300" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder='{"data": ["A", "1", "334", "M", "C"]}'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <div className="flex gap-2">
            <button
              onClick={validateAndProcessJson}
              className="w-1/2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Send POST</span>
            </button>

            <button
              onClick={fetchData}
              className="w-1/2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Fetch GET
            </button>
          </div>
        </div>

        {/* Display POST Response */}
        {processedData && (
          <div className="space-y-4">
            <h2 className="font-medium text-gray-900">POST Response</h2>
            <pre className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-sm">
              {JSON.stringify(processedData, null, 2)}
            </pre>
          </div>
        )}

        {/* Display GET Response */}
        {apiResponse && (
          <div className="space-y-4">
            <h2 className="font-medium text-gray-900">GET Response</h2>
            <pre className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-sm">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;