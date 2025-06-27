
import { formatDistanceToNow } from 'date-fns';

interface CountdownProps {
  targetDate: Date | null;
  status: string;
  lateRegEndDate?: Date | null;
}

const Countdown = ({ targetDate, status, lateRegEndDate }: CountdownProps) => {
  if (status === 'Late Reg' && lateRegEndDate) {
    return (
      <span className="text-amber-700 dark:text-amber-500 font-semibold">
        Late reg ends {formatDistanceToNow(lateRegEndDate, { addSuffix: true, includeSeconds: true })}
      </span>
    );
  }
  if (status === 'Running') {
    return <span className="text-destructive font-semibold">Running</span>;
  }
  if (status === 'Finished') {
    return <span className="text-muted-foreground">Finished</span>;
  }

  if (!targetDate) {
    return <span>{status}</span>;
  }
  
  // The 'dynamicStatus' prop is the source of truth.
  // This part of the component now handles 'Registering' and 'Upcoming' states,
  // for which our logic ensures the targetDate will be in the future.
  return (
    <span>
      {formatDistanceToNow(targetDate, { addSuffix: true, includeSeconds: true })}
    </span>
  );
};

export default Countdown;
