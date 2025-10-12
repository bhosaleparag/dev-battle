'use client' // Error boundaries must be Client Components

import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
 
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="bg-gray-08 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Error Card */}
          <div className="bg-gray-10 border border-gray-20 rounded-2xl p-8 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-60 opacity-20 blur-xl rounded-full"></div>
                <div className="relative bg-gray-15 p-4 rounded-full">
                  <AlertTriangle className="w-12 h-12 text-purple-60" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Error Title */}
            <h2 className="text-white-99 text-2xl font-bold mb-3">
              Oops! Something Went Wrong
            </h2>

            {/* Error Description */}
            <p className="text-gray-50 text-sm mb-6 leading-relaxed">
              We encountered an unexpected error. Don't worry, your progress is safe. 
              Try refreshing the page or return to the dashboard.
            </p>

            {/* Error Details (Optional - for debugging) */}
            {error?.message && (
              <div className="bg-gray-15 border border-gray-20 rounded-lg p-3 mb-6 text-left">
                <p className="text-gray-40 text-xs font-mono mb-1">Error Details:</p>
                <p className="text-gray-60 text-xs font-mono break-all">
                  {error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* Retry Button */}
              <button
                onClick={() => reset()}
                className="w-full bg-purple-60 hover:bg-purple-65 text-white-99 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Try Again
              </button>

              {/* Go Home Button */}
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-15 hover:bg-gray-20 text-white-90 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gray-20"
              >
                <Home className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-gray-40 text-xs text-center mt-6">
            If the problem persists, please contact support
          </p>
        </div>
      </body>
    </html>
  )
}