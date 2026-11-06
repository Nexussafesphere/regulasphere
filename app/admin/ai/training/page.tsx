import Link from "next/link";
import { ArrowRight, Bot, Database } from "lucide-react";

export default function AITrainingPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-navy">AI Training Pipeline</h2>
          <p className="mt-0.5 text-sm text-muted">Training job execution is not available in this deployment.</p>
        </div>
      </header>

      <section className="border-y border-border py-8">
        <div className="flex max-w-2xl items-start gap-4">
          <Database className="mt-1 h-5 w-5 shrink-0 text-gold" />
          <div>
            <h3 className="text-base font-semibold text-navy">Review the available training data</h3>
            <p className="mt-1 text-sm text-muted">
              Dataset review is available. Model training jobs are not connected to this console.
            </p>
            <Link href="/admin/ai" className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-army-green hover:text-army-green-dark">
              Open training data <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}