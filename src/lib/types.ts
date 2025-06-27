export type User = {
  id: number;
  username: string;
  email?: string;
  country?: string;
  avatar?: string;
};

export type BaseTournament = {
  id: number;
  name: string;
  gameType: string;
  buyIn: string;
  prizePool: string;
  startTime: string;
  status: string;
  durationHours: number;
  players: string[];
  maxPlayers: number;
};

export type Tournament = BaseTournament & {
  parsedStartTime: Date | null;
  dynamicStatus: string;
  lateRegEndDate: Date | null;
  isRegistered: boolean;
};

export type HandHistory = {
  id: string;
  date: string;
  gameType: string;
  stakes: string;
  result: number;
  myHand: string[];
  winningHand?: string[];
  potSize: number;
};

export type HandHistorySortKey = "date" | "gameType" | "stakes" | "result";

export type CashGame = {
  id: number;
  name: string;
  stakes: string;
  players: string;
  type: string;
  gameType: string;
};

export type SortDirection = "asc" | "desc";

export type TournamentSortKey = 'name' | 'gameType' | 'buyIn' | 'prizePool' | 'startTime' | 'status' | 'players';

export type CashGameSortKey = keyof CashGame;

export interface SortConfig<T> {
  key: T;
  direction: SortDirection;
}
