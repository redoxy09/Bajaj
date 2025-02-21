import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ProcessedData {
  alphabets?: string[];
  numbers?: string[];
  highestAlphabet?: string;
}

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const validateAndProcessJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        throw new Error('Input must contain a "data" array');
      }
      setError('');
      processData(parsedJson.data);
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const processData = (data: string[]) => {
    setProcessedData({
      alphabets: data.filter(item => /^[A-Za-z]$/.test(item)),
      numbers: data.filter(item => /^\d+$/.test(item)),
      highestAlphabet: data
        .filter(item => /^[A-Za-z]$/.test(item))
        .sort((a, b) => b.localeCompare(a))[0],
    });
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
                error ? 'border-red-300' : 'border-gray-200'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder='{"data": ["A", "1", "334", "M", "C"]}'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <button
            onClick={validateAndProcessJson}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Process</span>
          </button>
        </div>

        {processedData && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['Alphabets', 'Numbers', 'Highest Alphabet'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedFilters((prev) =>
                      prev.includes(filter)
                        ? prev.filter((f) => f !== filter)
                        : [...prev, filter]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedFilters.includes(filter)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {selectedFilters.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <h2 className="font-medium text-gray-900 mb-3">Results</h2>
                <div className="space-y-2">
                  {selectedFilters.includes('Alphabets') && processedData.alphabets && (
                    <div>
                      <span className="text-gray-600">Alphabets: </span>
                      <span className="font-medium">{processedData.alphabets.join(', ')}</span>
                    </div>
                  )}
                  {selectedFilters.includes('Numbers') && processedData.numbers && (
                    <div>
                      <span className="text-gray-600">Numbers: </span>
                      <span className="font-medium">{processedData.numbers.join(', ')}</span>
                    </div>
                  )}
                  {selectedFilters.includes('Highest Alphabet') && processedData.highestAlphabet && (
                    <div>
                      <span className="text-gray-600">Highest Alphabet: </span>
                      <span className="font-medium">{processedData.highestAlphabet}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;