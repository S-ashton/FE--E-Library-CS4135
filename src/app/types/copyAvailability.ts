export type CopyAvailabilityResult = "available" | "all_borrowed" | "error";

export type CopyAvailability = "loading" | CopyAvailabilityResult;
