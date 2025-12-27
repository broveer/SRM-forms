'use client';

import { useState } from 'react';

const categories = ['Clarity', 'Simplicity', 'Relevance', 'Ambiguity'] as const;
const ratings = [1, 2, 3, 4] as const;

// Placeholder questions - replace with actual questions
const questions = Array.from({ length: 15 }, (_, i) => `Question ${i + 1}: This is a sample question for face validity assessment. Please rate it on the following categories.`);

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Face Validity Assessment</h1>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Years of Experience in the Field</label>
                <input
                  type="text"
                  value={responderInfo.experience}
                  onChange={(e) => setResponderInfo(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Professional Qualifications</label>
                <textarea
                  value={responderInfo.qualifications}
                  onChange={(e) => setResponderInfo(prev => ({ ...prev, qualifications: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Why do you consider yourself an expert in assessing face validity?</label>
                <textarea
                  value={responderInfo.expertiseReason}
                  onChange={(e) => setResponderInfo(prev => ({ ...prev, expertiseReason: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>
          {questions.map((question, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{question}</h2>
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
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
    </div>
  );
}
