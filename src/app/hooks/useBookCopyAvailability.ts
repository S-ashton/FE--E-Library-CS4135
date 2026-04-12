import { useEffect, useState } from "react";
import type { CopyAvailability } from "../types/copyAvailability";
import { checkTitleHasAvailableCopy } from "../utils/checkTitleHasAvailableCopy";

export function useBookCopyAvailability(
  titleIds: number[],
  refreshToken: number
): Record<number, CopyAvailability> {
  const [map, setMap] = useState<Record<number, CopyAvailability>>({});
  const idsKey = [...new Set(titleIds)].sort((a, b) => a - b).join(",");

  useEffect(() => {
    const ids = [...new Set(titleIds)].sort((a, b) => a - b);
    if (ids.length === 0) {
      setMap({});
      return;
    }

    setMap((prev) => {
      const next = { ...prev };
      for (const id of ids) {
        next[id] = "loading";
      }
      return next;
    });

    let cancelled = false;

    Promise.all(
      ids.map(async (id) => {
        const result = await checkTitleHasAvailableCopy(id);
        return [id, result] as const;
      })
    ).then((pairs) => {
      if (cancelled) return;
      setMap((prev) => {
        const next = { ...prev };
        for (const [id, result] of pairs) {
          next[id] = result;
        }
        return next;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [idsKey, refreshToken]);

  return map;
}
