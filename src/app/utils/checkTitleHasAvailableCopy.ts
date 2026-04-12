import apiClient from "../services/apiClient";
import type { CopyAvailabilityResult } from "../types/copyAvailability";
import axios from "axios";

export async function checkTitleHasAvailableCopy(
  bookTitleId: number
): Promise<CopyAvailabilityResult> {
  try {
    await apiClient.get("/books/getAvailableCopy", {
      params: { bookId: bookTitleId },
    });
    return "available";
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      return "all_borrowed";
    }
    return "error";
  }
}
