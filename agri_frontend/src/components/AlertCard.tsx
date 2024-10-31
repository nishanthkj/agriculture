interface AlertCardProps {
  message: string;
  severity: "low" | "medium" | "high";
}

const AlertCard: React.FC<AlertCardProps> = ({ message, severity }) => {
  return (
    <div className={`alert-card severity-${severity}`}>
      <p>{message}</p>
    </div>
  );
};

export default AlertCard;
