import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import {
  BOOK_SEARCH_GENRES,
  BOOK_SEARCH_LANGUAGES,
} from "../../../constants/bookSearchOptions";
import { genreLabel, languageLabel } from "../../../utils/bookEnumLabels";
import styles from "./BookCatalogueSearchPanel.module.css";

type BookCatalogueSearchPanelProps = {
  idPrefix: string;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  filterGenre: string;
  onFilterGenreChange: (value: string) => void;
  filterYear: string;
  onFilterYearChange: (value: string) => void;
  filterLanguage: string;
  onFilterLanguageChange: (value: string) => void;
  onSubmitSearch: () => void;
  isSearching: boolean;
};

export default function BookCatalogueSearchPanel({
  idPrefix,
  searchQuery,
  onSearchQueryChange,
  filterGenre,
  onFilterGenreChange,
  filterYear,
  onFilterYearChange,
  filterLanguage,
  onFilterLanguageChange,
  onSubmitSearch,
  isSearching,
}: BookCatalogueSearchPanelProps) {
  const searchId = `${idPrefix}-library-search`;
  const genreId = `${idPrefix}-filter-genre`;
  const yearId = `${idPrefix}-filter-year`;
  const languageId = `${idPrefix}-filter-language`;
  const [yearError, setYearError] = useState<string | null>(null);

  const handleYearChange = (value: string) => {
    onFilterYearChange(value);
    if (value === "") {
      setYearError(null);
      return;
    }
    const n = Number(value);
    if (Number.isNaN(n) || n < 1000 || n > 2026) {
      setYearError("Year must be between 1000 and 2026.");
    } else {
      setYearError(null);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <SearchBar
          id={searchId}
          value={searchQuery}
          onChange={onSearchQueryChange}
          onSearch={onSubmitSearch}
          isLoading={isSearching}
        />
        <div className={styles.field}>
          <label className={styles.filterLabel} htmlFor={genreId}>
            Genre
          </label>
          <select
            id={genreId}
            className={`${styles.control} ${styles.selectGenre}`}
            value={filterGenre}
            onChange={(e) => onFilterGenreChange(e.target.value)}
          >
            <option value="">All</option>
            {BOOK_SEARCH_GENRES.map((g) => (
              <option key={g} value={g}>
                {genreLabel(g)}
              </option>
            ))}
          </select>
        </div>
        <div className={`${styles.field} ${styles.yearField}`}>
          <label className={styles.filterLabel} htmlFor={yearId}>
            Year
          </label>
          <input
            id={yearId}
            className={`${styles.control} ${styles.yearInput} ${yearError ? styles.inputError : ""}`}
            type="number"
            value={filterYear}
            onChange={(e) => handleYearChange(e.target.value)}
            placeholder="Any"
            min={1000}
            max={2026}
          />
          {yearError && <p className={styles.yearErrorMsg}>{yearError}</p>}
        </div>
        <div className={styles.field}>
          <label className={styles.filterLabel} htmlFor={languageId}>
            Language
          </label>
          <select
            id={languageId}
            className={`${styles.control} ${styles.selectLanguage}`}
            value={filterLanguage}
            onChange={(e) => onFilterLanguageChange(e.target.value)}
          >
            <option value="">All</option>
            {BOOK_SEARCH_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {languageLabel(lang)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
