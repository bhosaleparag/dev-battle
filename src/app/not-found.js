import Link from 'next/link'
import { FileQuestion, Code2, Home, Search } from 'lucide-react'
 
export default function NotFound() {
  return (
    <div className="min-h-[90vh] bg-gray-08 flex flex-col items-center justify-center text-center px-4">
      <div>
        {/* 404 Illustration */}
        <div className="relative mb-8">
          {/* Glowing background effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-purple-60 opacity-10 blur-3xl rounded-full"></div>
          </div>
          
          {/* 404 with Code Theme */}
          <div className="relative">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Code2 className="w-16 h-16 text-gray-20" strokeWidth={1.5} />
              <h1 className="text-8xl font-bold text-white-99">404</h1>
              <Code2 className="w-16 h-16 text-gray-20" strokeWidth={1.5} />
            </div>
            
            {/* Icon */}
            <div className="flex justify-center">
              <div className="bg-gray-10 border border-gray-20 p-4 rounded-2xl">
                <FileQuestion className="w-12 h-12 text-purple-60" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-white-99 text-2xl font-bold mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-50 text-sm leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to coding challenges!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/"
            className="flex-1 bg-purple-60 hover:bg-purple-65 text-white-99 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
          
          <Link
            href="/battles"
            className="flex-1 bg-gray-15 hover:bg-gray-20 text-white-90 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gray-20"
          >
            <Search className="w-5 h-5" />
            Browse Challenges
          </Link>
        </div>
      </div>
    </div>
  );
}