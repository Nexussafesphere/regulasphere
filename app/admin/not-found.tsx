import Link from "next/link";
import { Shield } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="card text-center py-16">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
        <Shield className="w-8 h-8 text-muted" />
      </div>
      <h2 className="text-xl font-bold text-navy mb-2">Page Not Found</h2>
      <p className="text-muted text-sm mb-6">The admin page you are looking for does not exist.</p>
      <Link href="/admin" className="btn-primary">
        Back to Dashboard
      </Link>
    </div>
  );
}