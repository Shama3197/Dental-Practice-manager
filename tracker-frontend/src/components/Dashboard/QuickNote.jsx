import React, { useState } from 'react';

const QuickNote = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [note, setNote] = useState('');

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
    // Simulate recording
    if (!isRecording) {
      setTimeout(() => {
        setNote('Sample note: Patient reported sensitivity in upper right molar. Recommended follow-up in 2 weeks.');
        setIsRecording(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-background-dark rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Note</h2>
      <div className="space-y-4">
        <button
          onClick={handleRecordClick}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 ${
            isRecording
              ? 'bg-error text-white animate-pulse'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
        
        {note && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">{note}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickNote; 