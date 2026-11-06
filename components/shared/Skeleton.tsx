interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-silver-light rounded-lg ${className}`}
      style={{ minHeight: "20px" }}
    />
  );
}