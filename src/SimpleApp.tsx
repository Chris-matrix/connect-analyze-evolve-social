import React from 'react';

const SimpleApp: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Social Connect Dashboard</h1>
        <p className="text-center text-gray-600 mb-4">Simple test page to verify React rendering</p>
        <div className="flex justify-center">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => console.log('Button clicked')}
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleApp;
