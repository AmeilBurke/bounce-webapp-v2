// Either an image of someone new, or a previously banned person whose photo is reused
export type CreateAlertDto =
    | { image: File; reason: string; bannedPersonId?: undefined }
    | { image?: undefined; reason: string; bannedPersonId: string };
