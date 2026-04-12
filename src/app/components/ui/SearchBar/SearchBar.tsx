import type { FormEvent, InputHTMLAttributes } from "react";
import styles from "./SearchBar.module.css";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  id?: string;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "disabled" | "placeholder" | "id" | "type"
  >;
};

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search…",
  isLoading = false,
  disabled = false,
  label = "Search",
  id = "search-bar-input",
  inputProps,
}: SearchBarProps) {
  const busy = isLoading;
  const effectiveDisabled = disabled || busy;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch?.();
  }

  return (
    <form
      className={styles.root}
      onSubmit={handleSubmit}
      role="search"
      aria-label={label}
    >
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.field}>
        <input
          id={id}
          type="search"
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={effectiveDisabled}
          autoComplete="off"
          enterKeyHint="search"
          aria-busy={busy}
          {...inputProps}
        />
        {busy ? (
          <span className={styles.spinner} aria-hidden />
        ) : null}
      </div>
    </form>
  );
}