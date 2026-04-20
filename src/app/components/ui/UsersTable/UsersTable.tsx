import { useMemo } from "react";
import styles from "./UsersTable.module.css";
import type { UserListItem } from "../../../store/usersSlice";

type UsersTableProps = {
  users: UserListItem[];
  error?: string | null;
  isLoading: boolean;
  currentUserId?: string;
  onSelectUser?: (user: UserListItem) => void;
  onDeleteUser?: (user: UserListItem) => void;
};

export default function UsersTable({
  users,
  error,
  isLoading,
  currentUserId,
  onSelectUser,
  onDeleteUser,
}: UsersTableProps) {
  // Sort so the current user always appears at the top of the table.
  const sortedUsers = useMemo(() => {
    if (!currentUserId) return users;
    return [...users].sort((a, b) => {
      const aIsSelf = String(a.id) === String(currentUserId) ? 0 : 1;
      const bIsSelf = String(b.id) === String(currentUserId) ? 0 : 1;
      return aIsSelf - bIsSelf;
    });
  }, [users, currentUserId]);

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
              {onDeleteUser && <th className={styles.headCell}>Delete</th>}
            </tr>
          </thead>

          <tbody>
            {sortedUsers.map((user) => {
              const isSelf = currentUserId != null && String(user.id) === String(currentUserId);
              const canClick = onSelectUser && !isSelf;
              const canDelete = onDeleteUser && !isSelf;

              return (
                <tr
                  key={user.id}
                  className={`${styles.row} ${canClick ? styles.clickableRow : ""}`}
                  onClick={canClick ? () => onSelectUser(user) : undefined}
                >
                  <td className={styles.titleCell}>{user.email}</td>
                  <td className={styles.cell}>
                    <span className={styles.categoryBadge}>{user.role}</span>
                  </td>
                  <td className={styles.cell}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  {onDeleteUser && (
                    <td className={styles.cell}>
                      {canDelete && (
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteUser(user);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}