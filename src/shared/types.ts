export interface ServerToClientEvents {
  alert: () => void;
  staff: () => void;
  venue: () => void;
  ban: () => void;
  bannedPerson: () => void;
}

export interface ClientToServerEvents { }