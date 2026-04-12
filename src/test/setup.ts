import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("../app/hooks/useBookCopyAvailability", () => ({
  useBookCopyAvailability: vi.fn(() => ({})),
}));
