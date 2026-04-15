import apiClient from "../services/apiClient";
import type { CopyAvailabilityResult } from "../types/copyAvailability";
import axios from "axios";

export async function checkTitleHasAvailableCopy(
  bookTitleId: number
): Promise<CopyAvailabilityResult> {
  try {
    const response = await apiClient.get<number>("/books/countCopies", {
      params: { bookId: bookTitleId, status: "AVAILABLE" },
    });
    return response.data > 0 ? "available" : "all_borrowed";
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      return "all_borrowed";
    }
    return "error";
  }
}
