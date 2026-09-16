export const Role = {
  ADMIN: "ADMIN",
  BOUNCER: "BOUNCER",
  // VENUE_MANAGER: "VENUE_MANAGER",
  // DUTY_MANAGER: "DUTY_MANAGER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];