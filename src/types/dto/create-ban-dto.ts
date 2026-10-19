export type CreateBanDto = {
    reason: string;
    startDate: string;
    endDate: string;
    bannedPersonId: string;
    venueIds: string[];
};
