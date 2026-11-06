export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton h-10 w-10 mb-4" />
            <div className="skeleton h-3 w-20 mb-2" />
            <div className="skeleton h-6 w-12" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card admin-chart-card">
            <div className="skeleton h-64 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}