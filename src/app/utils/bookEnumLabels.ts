const GENRE_LABELS: Record<string, string> = {
  ROMANCE: "Romance",
  FANTASY: "Fantasy",
  MEMOIR: "Memoir",
  CHILDREN: "Children",
  YA: "Young Adult",
  TRUECRIME: "True Crime",
  SCIFI: "Science Fiction",
  THRILLER: "Thriller",
  SELFHELP: "Self Help",
  HISTORICALFICTION: "Historical Fiction",
  HISTORICALNF: "Historical Non-Fiction",
  NONFICTION: "Non-Fiction",
};

const LANGUAGE_LABELS: Record<string, string> = {
  CHINESE: "Chinese",
  SPANISH: "Spanish",
  ENGLISH: "English",
  HINDI: "Hindi",
  ARABIC: "Arabic",
  BENGALI: "Bengali",
  PORTUGESE: "Portuguese",
  RUSSIAN: "Russian",
  JAPANESE: "Japanese",
  PUNJABI: "Punjabi",
  GERMAN: "German",
  FRENCH: "French",
  POLISH: "Polish",
  ITALIAN: "Italian",
};

export function genreLabel(value: string): string {
  return GENRE_LABELS[value?.toUpperCase()] ?? value;
}

export function languageLabel(value: string): string {
  return LANGUAGE_LABELS[value?.toUpperCase()] ?? value;
}
