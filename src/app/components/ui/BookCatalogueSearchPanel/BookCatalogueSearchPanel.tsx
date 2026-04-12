import SearchBar from "../SearchBar/SearchBar";
import {
  BOOK_SEARCH_GENRES,
  BOOK_SEARCH_LANGUAGES,
} from "../../../constants/bookSearchOptions";
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
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.filterLabel} htmlFor={yearId}>
            Year
          </label>
          <input
            id={yearId}
            className={`${styles.control} ${styles.yearInput}`}
            type="number"
            value={filterYear}
            onChange={(e) => onFilterYearChange(e.target.value)}
            placeholder="Any"
            min={0}
          />
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
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
