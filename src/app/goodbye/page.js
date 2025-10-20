import { Trash2 } from "lucide-react";
import Link from "next/link";

export default function GoodbyePage() {
  return (
    <div className="min-h-screen bg-gray-08 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-purple-60/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 className="w-10 h-10 text-purple-60" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Account Deleted</h1>
        <p className="text-gray-50 mb-8">
          Your account and all associated data have been permanently deleted. We're sorry to see you go!
        </p>
        <Link
          href='/'
          className="inline-block bg-purple-60 hover:bg-purple-65 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}