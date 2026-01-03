'use client';

import { useState } from 'react';

const categories = ['Clarity', 'Simplicity', 'Relevance', 'Ambiguity'] as const;
const ratings = [1, 2, 3, 4] as const;

// Placeholder questions - replace with actual questions
const questions = [
  "What is your highest educational qualification?",
  "How many years have you been investing in the stock market?",
  "Which platform do you primarily use for financial advice/news?",
  "Have you ever invested in a stock or IPO solely based on a recommendation from a social media influencer?",
  "How frequently do you trade in the stock market?",
  "Do you invest a lot of your money in risky stocks like SMEs?", /* "Approximately what percentage (%) of your total investment portfolio is allocated to High-Risk/SME stocks?", */
  "Do you find Annual Reports boring and prefer watching Instagram Reels for advice?", /* "Please rate your agreement with the following statements regarding your investment behavior.", */
  "On a scale of 1 to 10, how much do you trust financial advice given by influencers who do NOT disclose their qualifications?",
  "Are you aware of SEBI's recent crackdown on unregistered financial advisors?",
  "When viewing a \"Sponsored\" post about a stock, how likely are you to be skeptical of the advice?",
  "Rank the following factors in order of importance when you choose an IPO.",
  "Don't you agree that finfluencers are dangerous for the Indian economy?" /* "In your opinion, what is the biggest risk of following \"Finfluencers\" in India today?" */
];

type ResponderInfo = {
  name: string;
  experience: string;
  qualifications: string;
  expertiseReason: string;
};

type FormData = {
  [key: string]: {
    clarity: number;
    simplicity: number;
    relevance: number;
    ambiguity: number;
  };
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>({});
  const [responderInfo, setResponderInfo] = useState<ResponderInfo>({
    name: '',
    experience: '',
    qualifications: '',
    expertiseReason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleRatingChange = (questionIndex: number, category: string, rating: number) => {
    setFormData(prev => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        [category.toLowerCase()]: rating,
      },
    }));
  };

  const validateForm = () => {
    // Check responder info
    if (!responderInfo.name.trim() || !responderInfo.experience.trim() || !responderInfo.qualifications.trim() || !responderInfo.expertiseReason.trim()) {
      return false;
    }
    // Check ratings
    for (let i = 0; i < questions.length; i++) {
      const qData = formData[i];
      if (!qData) return false;
      for (const cat of categories) {
        const key = cat.toLowerCase() as keyof typeof qData;
        if (qData[key] === undefined) return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'Please complete all ratings before submitting.' });
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responderInfo, ratings: formData }),
      });
      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Form submitted successfully!' });
        setFormData({});
        setResponderInfo({
          name: '',
          experience: '',
          qualifications: '',
          expertiseReason: '',
        });
      } else {
        const error = await response.json();
        setSubmitStatus({ type: 'error', message: error.error || 'Submission failed.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4 underline decoration-green-500 decoration-2">Digital Hype & The Indian Retail Investor</h1>
        <p className="text-lg text-center text-gray-700 mb-8 italic">
          We are students from Christ (Deemed to be University) conducting a study on how social media influences investment decisions in Indian stock markets. All data will be kept confidential.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About Face Validity Assessment</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Face validity</strong> is a measure of whether a test or survey appears to measure what it is supposed to measure. In this study, we are assessing whether our survey questions effectively capture the intended concepts related to investor behavior and social media influence.
            </p>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Please rate each question on these 4 categories:</h3>
              <ul className="space-y-2">
                <li><strong className="text-green-600">Clarity:</strong> How clear and understandable is the question?</li>
                <li><strong className="text-green-600">Simplicity:</strong> How straightforward and uncomplicated is the question?</li>
                <li><strong className="text-green-600">Relevance:</strong> How relevant is the question to the topic of social media influence on investment decisions?</li>
                <li><strong className="text-green-600">Ambiguity:</strong> How ambiguous or unclear is the question? (Higher ratings indicate more ambiguity)</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              Rate each category from 1 (low) to 4 (high) based on your expert assessment.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Responder Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={responderInfo.name}
                  onChange={(e) => setResponderInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Years of Experience in the Field</label>
                <input
                  type="text"
                  value={responderInfo.experience}
                  onChange={(e) => setResponderInfo(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Professional Qualifications</label>
                <textarea
                  value={responderInfo.qualifications}
                  onChange={(e) => setResponderInfo(prev => ({ ...prev, qualifications: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>
            {questions.map((question, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{index + 1}. {question}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map(category => (
                <div key={category} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{category}</label>
                <div className="flex space-x-2">
                  {ratings.map(rating => {
                  const isSelected = formData[index]?.[category.toLowerCase() as keyof typeof formData[number]] === rating;
                  return (
                    <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(index, category, rating)}
                    className={`px-3 py-2 border rounded-md transition-colors ${
                      isSelected
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                    }`}
                    >
                    {rating}
                    </button>
                  );
                  })}
                </div>
                </div>
              ))}
              </div>
            </div>
            ))}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </form>
        {submitStatus && (
          <div className={`mt-8 p-4 rounded-md ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitStatus.message}
          </div>
        )}
      </div>
      <footer className="mt-12 text-center text-gray-600">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
          <h4 className="font-semibold text-blue-800 mb-2">🔒 Privacy & Security</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Data is encrypted and stored securely on MongoDB</li>
            <li>• Hosted on Vercel with SSL encryption (HTTPS)</li>
            <li>• No personal information is shared with third parties</li>
            <li>• Data will only be used for academic research purposes</li>
          </ul>
        </div>
        <div className="flex items-center justify-center mb-2">
          <span className="text-green-600 text-xl mr-2">✓</span>
          <span className="font-medium">This website is safe and secure</span>
        </div>
        <p className="text-sm mb-4">
          Hosted on Vercel - a trusted platform used by millions of developers worldwide for secure web applications.
        </p>
        <div className="flex justify-center items-center space-x-4">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
            ✓ SSL Secured
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
            🏛️ University Study
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
            🔐 GDPR Compliant
          </span>
        </div>
      </footer>
    </div>
  );
}
