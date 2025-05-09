import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { StrictMode } from 'react'

const rootElement = document.getElementById('root')

if (rootElement) {
  const root = createRoot(rootElement)
  
  try {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  } catch (error) {
    console.error('Error rendering application:', error)
    root.render(
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-red-600">Application Error</h1>
          <p className="text-center text-gray-600 mb-4">There was an error loading the application. Please check the console for details.</p>
        </div>
      </div>
    )
  }
}
