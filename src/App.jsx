import React, { useState, useEffect } from 'react';

// Main App Component
const App = () => {
  // State variables to manage the application's data and UI
  const [amount, setAmount] = useState('1');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [rates, setRates] = useState({});
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API endpoint for fetching currency rates
  const API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok. Please try again later.');
        }
        const data = await response.json();
        
        // Set the date and the exchange rates from the API response
        setDate(data.date);
        setRates(data.usd);
        
        // Set a default target currency (e.g., the first one in the list)
        if (data.usd && Object.keys(data.usd).length > 0) {
            setTargetCurrency(Object.keys(data.usd)[0]);
        }

      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencyData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to handle the currency conversion
  const handleConvert = () => {
    // Reset previous conversion
    setConvertedAmount(null);
    
    // Basic validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }
    if (!targetCurrency) {
      alert('Please select a target currency.');
      return;
    }

    // Calculate the converted amount
    const rate = rates[targetCurrency];
    const result = (parseFloat(amount) * rate).toFixed(2);
    setConvertedAmount(result);
  };

  // Function to handle input changes and allow only numbers
  const handleAmountChange = (e) => {
      const value = e.target.value;
      // Regex to allow numbers and a single decimal point
      if (/^\d*\.?\d*$/.test(value)) {
          setAmount(value);
      }
  };


  return (
    <div className="min-h-screen bg-gray-900 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-2 tracking-wide">
          Currency X
        </h1>
        <p className="text-center text-gray-400 mb-8 text-lg">
          Effortless USD Conversions
        </p>
        
        {/* Main form for conversion */}
        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              Amount in USD
            </label>
            <div className="relative">
                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">$</span>
                <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-inner text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                    placeholder="Enter amount"
                />
            </div>
          </div>

          {/* Target Currency Dropdown */}
          <div>
            <label htmlFor="target-currency" className="block text-sm font-medium text-gray-300 mb-2">
              To Currency
            </label>
            <select
              id="target-currency"
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              disabled={loading}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-inner text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 appearance-none pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%239CA3AF'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em 1.5em',
              }}
            >
              {loading ? (
                <option className="text-gray-500">Loading currencies...</option>
              ) : (
                Object.keys(rates).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency.toUpperCase()}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition duration-300 ease-in-out text-lg tracking-wide"
          >
            {loading ? 'Fetching Rates...' : 'Convert Amount'}
          </button>
        </div>

        {/* Display Area for Error, Result, and Date */}
        <div className="mt-8 text-center">
            {error && (
                <p className="text-red-400 bg-red-900 bg-opacity-30 p-4 rounded-lg border border-red-700">{error}</p>
            )}

            {convertedAmount && !error && (
                <div className="bg-gray-700 p-5 rounded-lg border border-gray-600 shadow-md">
                    <p className="text-xl text-gray-300 mb-2">Converted Amount:</p>
                    <p className="text-4xl font-extrabold text-purple-400">
                        {convertedAmount} <span className="text-2xl font-semibold text-gray-300">{targetCurrency.toUpperCase()}</span>
                    </p>
                </div>
            )}
            
            {date && !error && (
                <p className="text-xs text-gray-500 mt-6">
                    Rates last updated on: {date}
                </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default App;

