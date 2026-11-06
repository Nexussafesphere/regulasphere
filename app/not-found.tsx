import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <div className="text-center">
        <SearchX className="w-16 h-16 text-muted mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-navy mb-2">404</h1>
        <p className="text-sm text-muted mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}