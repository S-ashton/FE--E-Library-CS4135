const STORAGE_KEY = "eLibrary:loanCopyByLoanId";

function readMap(): Record<string, number> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, number>)
      : {};
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, number>): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function setLoanCopyId(loanId: string, copyId: number): void {
  const map = readMap();
  map[loanId] = copyId;
  writeMap(map);
}

export function getLoanCopyId(loanId: string): number | undefined {
  const id = readMap()[loanId];
  return typeof id === "number" ? id : undefined;
}

export function removeLoanCopyId(loanId: string): void {
  const map = readMap();
  if (loanId in map) {
    delete map[loanId];
    writeMap(map);
  }
}

const COPY_TITLE_KEY = "eLibrary:copyIdToTitleId";

function readCopyTitleMap(): Record<string, number> {
  try {
    const raw = sessionStorage.getItem(COPY_TITLE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, number>)
      : {};
  } catch {
    return {};
  }
}

function writeCopyTitleMap(map: Record<string, number>): void {
  try {
    sessionStorage.setItem(COPY_TITLE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function registerCopyTitleId(copyId: number, titleId: number): void {
  const map = readCopyTitleMap();
  map[String(copyId)] = titleId;
  writeCopyTitleMap(map);
}

export function resolveCatalogueTitleId(loanBookIdField: string): number {
  const n = Number(loanBookIdField);
  if (Number.isNaN(n)) return n;
  const fromCopy = readCopyTitleMap()[String(n)];
  return typeof fromCopy === "number" ? fromCopy : n;
}
