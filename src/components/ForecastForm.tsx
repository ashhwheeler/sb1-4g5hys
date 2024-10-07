import React, { useState } from 'react';
import { Search, Send } from 'lucide-react';
import { getForecast, getFollowUpResponse } from '../services/openai';

const ForecastForm: React.FC = () => {
  const [sportType, setSportType] = useState<'surf' | 'kitesurf'>('surf');
  const [location, setLocation] = useState('');
  const [timeFrame, setTimeFrame] = useState<'3days' | 'week'>('3days');
  const [forecast, setForecast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpResponse, setFollowUpResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await getForecast(sportType, location, timeFrame === '3days' ? 'next three days' : 'coming week');
      setForecast(result);
      setFollowUpResponse(null);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      setError('Error fetching forecast. Please try again.');
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await getFollowUpResponse(sportType, location, timeFrame, forecast || '', followUpQuestion);
      setFollowUpResponse(result);
    } catch (error) {
      console.error('Error fetching follow-up response:', error);
      setError('Error fetching response. Please try again.');
      setFollowUpResponse(null);
    } finally {
      setIsLoading(false);
      setFollowUpQuestion('');
    }
  };

  const formatForecast = (text: string | null) => {
    if (!text) return null;

    const lines = text.split('\n');
    let formattedContent: JSX.Element[] = [];
    let currentDay: string | null = null;
    let listItems: JSX.Element[] = [];

    lines.forEach((line, index) => {
      line = line.trim();
      if (!line) return;

      if (line.match(/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i) || line.toLowerCase().includes('day')) {
        if (currentDay) {
          formattedContent.push(
            <div key={`day-${index}`}>
              <h3 className="text-lg font-semibold text-blue-600 mt-4 mb-2">{currentDay}</h3>
              <ul className="list-disc pl-5 space-y-2">{listItems}</ul>
            </div>
          );
          listItems = [];
        }
        currentDay = line;
      } else if (currentDay) {
        listItems.push(<li key={`item-${index}`} className="text-gray-700">{line}</li>);
      } else {
        formattedContent.push(<p key={`para-${index}`} className="text-gray-700 mb-2">{line}</p>);
      }
    });

    if (currentDay) {
      formattedContent.push(
        <div key={`day-last`}>
          <h3 className="text-lg font-semibold text-blue-600 mt-4 mb-2">{currentDay}</h3>
          <ul className="list-disc pl-5 space-y-2">{listItems}</ul>
        </div>
      );
    }

    return <div className="space-y-2">{formattedContent}</div>;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Get Your Forecast</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setSportType('surf')}
            className={`flex-1 py-2 px-4 rounded-full ${
              sportType === 'surf' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Surf
          </button>
          <button
            type="button"
            onClick={() => setSportType('kitesurf')}
            className={`flex-1 py-2 px-4 rounded-full ${
              sportType === 'kitesurf' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Kitesurf
          </button>
        </div>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setTimeFrame('3days')}
            className={`flex-1 py-2 px-4 rounded-full ${
              timeFrame === '3days' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Next 3 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeFrame('week')}
            className={`flex-1 py-2 px-4 rounded-full ${
              timeFrame === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Coming Week
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="animate-spin mr-2">&#9696;</span>
          ) : (
            <Search size={20} className="mr-2" />
          )}
          Get Forecast
        </button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {forecast && (
        <div className="mt-6 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Forecast for {location}</h3>
          <div className="forecast-content">
            {formatForecast(forecast)}
          </div>
          <form onSubmit={handleFollowUpSubmit} className="mt-4">
            <div className="flex items-center">
              <input
                type="text"
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask a follow-up question..."
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin">&#9696;</span>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      {followUpResponse && (
        <div className="mt-4 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Additional Information</h3>
          <div className="forecast-content">
            {formatForecast(followUpResponse)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastForm;