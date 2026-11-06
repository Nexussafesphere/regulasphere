interface VerificationBadgeProps {
  status: string;
}

export default function VerificationBadge({ status }: VerificationBadgeProps) {
  const getBadgeClass = (status: string) => {
    switch (status) {
      case "Verified":
        return "badge badge-gold";
      case "Rejected":
        return "badge badge-silver";
      case "Needs Review":
        return "badge badge-outline";
      case "Under Review":
        return "badge badge-outline";
      default:
        return "badge badge-silver";
    }
  };

  return <span className={getBadgeClass(status)}>{status}</span>;
}