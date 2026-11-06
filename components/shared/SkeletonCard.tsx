import Skeleton from "./Skeleton";

export default function SkeletonCard() {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="w-2/3 h-5 mb-2" />
          <Skeleton className="w-1/3 h-3" />
        </div>
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-3/4 h-4" />
    </div>
  );
}