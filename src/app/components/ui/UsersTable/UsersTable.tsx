import styles from "./UsersTable.module.css";
import type { UserListItem } from "../../../store/usersSlice";

type UsersTableProps = {
  users: UserListItem[];
  error?: string | null;
  isLoading: boolean;
};

export default function UsersTable({
  users,
  error,
  isLoading,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <section className={styles.tableCard}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Users</h2>
        </div>
        <div className={styles.stateMessage}>Loading users...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.tableCard}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Users</h2>
        </div>
        <div className={styles.stateMessage}>{error}</div>
      </section>
    );
  }

  if (users.length === 0) {
    return (
      <section className={styles.tableCard}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Users</h2>
        </div>
        <div className={styles.stateMessage}>No users found.</div>
      </section>
    );
  }

  return (
    <section className={styles.tableCard}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Users</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeadRow}>
              <th className={styles.headCell}>User Email</th>
              <th className={styles.headCell}>Role</th>
              <th className={styles.headCell}>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={styles.row}>
                <td className={styles.titleCell}>{user.email}</td>
                <td className={styles.cell}>
                  <span className={styles.categoryBadge}>{user.role}</span>
                </td>
                <td className={styles.cell}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}