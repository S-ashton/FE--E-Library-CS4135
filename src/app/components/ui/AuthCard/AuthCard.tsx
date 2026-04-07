import type { ReactNode } from "react";
import styles from "./AuthCard.module.css";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>

        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {children}
    </div>
  );
}