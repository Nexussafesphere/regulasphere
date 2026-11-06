interface ComplianceScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function ComplianceScore({
  score,
  size = "md",
}: ComplianceScoreProps) {
  const dimensions = {
    sm: { outer: "w-14 h-14", inner: "w-11 h-11", text: "text-sm" },
    md: { outer: "w-20 h-20", inner: "w-16 h-16", text: "text-lg" },
    lg: { outer: "w-28 h-28", inner: "w-24 h-24", text: "text-2xl" },
  };

  const current = dimensions[size];

  return (
    <div
      className={`${current.outer} mx-auto rounded-full flex items-center justify-center`}
      style={{
        background: `conic-gradient(var(--gold) ${score}%, var(--off-white) ${score}% 100%)`,
      }}
    >
      <div
        className={`${current.inner} rounded-full bg-white flex items-center justify-center`}
      >
        <span className={`${current.text} font-bold text-navy`}>{score}%</span>
      </div>
    </div>
  );
}