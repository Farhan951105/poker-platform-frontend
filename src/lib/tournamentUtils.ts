import { type VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";
import { isBefore, addMinutes, addHours } from 'date-fns';
import { BaseTournament, Tournament } from "./types";
import { parseTournamentStartTime } from "./dateUtils";

export const getTournamentStatusVariant = (dynamicStatus: string): VariantProps<typeof badgeVariants>['variant'] => {
  switch(dynamicStatus) {
    case 'Registering':
      return 'default';
    case 'Late Reg':
      return 'warning';
    case 'Running':
      return 'destructive';
    case 'Finished':
    case 'Upcoming':
    default:
      return 'secondary';
  }
};

const LATE_REG_DURATION_MINUTES = 15;

type InputTournament = BaseTournament & { parsedStartTime?: Date | null };

export const calculateTournamentDynamicState = (tournament: InputTournament, now: Date): Tournament => {
  // Use existing parsedStartTime if available, otherwise parse it.
  const parsedStartTime = tournament.parsedStartTime ?? parseTournamentStartTime(tournament.startTime);

  // If we can't parse the start time, return a default state
  if (!parsedStartTime) {
    return {
      ...tournament,
      parsedStartTime: null,
      dynamicStatus: tournament.status || 'Upcoming',
      lateRegEndDate: null,
    };
  }

  const isStarted = isBefore(parsedStartTime, now);
  const lateRegEndDate = addMinutes(parsedStartTime, LATE_REG_DURATION_MINUTES);
  const isLateRegOver = isBefore(lateRegEndDate, now);
  const tournamentEndDate = addHours(parsedStartTime, tournament.durationHours);
  const isFinished = isBefore(tournamentEndDate, now);

  let dynamicStatus: string;
  if (isFinished) {
    dynamicStatus = 'Finished';
  } else if (isLateRegOver) {
    dynamicStatus = 'Running';
  } else if (isStarted) {
    dynamicStatus = 'Late Reg';
  } else {
    dynamicStatus = tournament.status || 'Upcoming';
  }

  return {
    ...tournament,
    parsedStartTime,
    dynamicStatus,
    lateRegEndDate,
  };
};
