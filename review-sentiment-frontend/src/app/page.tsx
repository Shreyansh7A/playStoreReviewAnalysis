'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [appName, setAppName] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/reviews/analyze', { appName });
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Play Store App Review Analyzer</h1>

      <input
        type="text"
        placeholder="Enter App Name (e.g., Instagram)"
        className="w-full border p-2 mb-4"
        value={appName}
        onChange={(e) => setAppName(e.target.value)}
      />
      <button
        onClick={handleAnalyze}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {data && (
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-4">
            <img src={data.appInfo.icon} alt="icon" className="w-12 h-12" />
            <div>
              <p className="font-semibold text-lg">{data.appInfo.name}</p>
              <p>By {data.appInfo.developer}</p>
              <p>Rating: {data.appInfo.rating}</p>
            </div>
          </div>

          <div className="mb-6">
            <p><strong>Avg Score:</strong> {data.sentimentData.averageScore}</p>
            <p><strong>Review Count:</strong> {data.sentimentData.reviewCount}</p>
            <p><strong>Positive:</strong> {data.sentimentData.positivePercentage}%</p>
            <p><strong>Negative:</strong> {data.sentimentData.negativePercentage}%</p>
            <p><strong>Neutral:</strong> {data.sentimentData.neutralPercentage}%</p>
          </div>

          <h2 className="text-xl font-semibold mb-2">Sample Reviews</h2>
          <div className="space-y-4">
            {data.reviewSamples.slice(0, 5).map((review: any) => (
              <div key={review.id} className="border p-4 rounded">
                <div className="flex gap-2 items-center mb-1">
                  <img src={review.userImage} alt="" className="w-6 h-6 rounded-full" />
                  <p className="font-medium">{review.userName}</p>
                </div>
                <p className="italic">"{review.content}"</p>
                <p className="text-sm text-gray-600">
                  Sentiment: {review.sentiment} ({review.sentimentScore})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
