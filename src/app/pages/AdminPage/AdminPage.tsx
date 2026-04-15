import { useCallback, useEffect, useState } from "react";
import UsersTable from "../../components/ui/UsersTable/UsersTable";
import EditUserForm from "../../components/ui/EditUserForm/EditUserForm";
import DeleteCheck from "../../components/ui/deleteCheck/deleteCheck";
import { useGetUsers } from "../../hooks/useGetUers";
import AddUserForm from "../../components/ui/AddUsersForm/AddUsersForm";
import { useAddUser } from "../../hooks/useAddUser";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  registerUser,
  deleteUserAdminAction,
  updateUserRoleAdminAction,
  updateUserEmailAdminAction,
} from "../../store/usersSlice";
import type { UserListItem } from "../../store/usersSlice";
import type { UserRole } from "../../store/authSlice";
import { useToast } from "../../hooks/useToast";

export default function AdminPage() {
  const { users, isLoading, error, refreshUsers } = useGetUsers();
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();

  const { isAddingUser } = useAppSelector((state) => state.users);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [userToDelete, setUserToDelete] = useState<UserListItem | null>(null);

  const {
    email,
    password,
    role,
    error: addUserError,
    isSubmitting,
    setEmail,
    setPassword,
    setRole,
    handleSubmit,
  } = useAddUser({
    onAddUser: async (userData) => {
      try {
        await dispatch(registerUser(userData)).unwrap();
        await refreshUsers();
        showSuccess("User added successfully!");
      } catch (err) {
        showError("Failed to add user.");
        throw err;
      }
    },
  });

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const handleEditUser = useCallback(
    async (fields: { email: string; role: UserRole }) => {
      if (!selectedUser) return;
      setEditError(null);
      setIsEditSubmitting(true);

      try {
        // Update role if it changed
        if (fields.role !== selectedUser.role) {
          await dispatch(
            updateUserRoleAdminAction({ userId: selectedUser.id, role: fields.role })
          ).unwrap();
        }

        // Update email if it changed
        if (fields.email !== selectedUser.email) {
          await dispatch(
            updateUserEmailAdminAction({ userId: selectedUser.id, email: fields.email })
          ).unwrap();
        }

        setSelectedUser(null);
        showSuccess("User updated successfully!");
      } catch (err: unknown) {
        const message = typeof err === "string" ? err : "Failed to update user. Please try again.";
        setEditError(message);
      } finally {
        setIsEditSubmitting(false);
      }
    },
    [selectedUser, dispatch, showSuccess]
  );

  const handleDeleteUser = useCallback(async () => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteUserAdminAction(userToDelete.id)).unwrap();
      setUserToDelete(null);
      showSuccess("User deleted successfully!");
    } catch (err: unknown) {
      const message = typeof err === "string" ? err : "Failed to delete user. Please try again.";
      showError(message);
      setUserToDelete(null);
    }
  }, [userToDelete, dispatch, showSuccess, showError]);

  return (
    <div
      style={{
        display: "grid",
        gap: "24px",
      }}
    >
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          padding: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            color: "#0f172a",
          }}
        >
          Admin Dashboard
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#475569",
            maxWidth: "720px",
          }}
        >
          Admin tools and user management.
        </p>
      </section>

      <UsersTable
        users={users}
        isLoading={isLoading}
        error={error}
        currentUserId={currentUser?.id}
        onSelectUser={setSelectedUser}
        onDeleteUser={setUserToDelete}
      />

      {selectedUser && (
        <EditUserForm
          user={selectedUser}
          isSubmitting={isEditSubmitting}
          error={editError}
          onClose={() => {
            setSelectedUser(null);
            setEditError(null);
          }}
          onSubmit={handleEditUser}
        />
      )}

      {userToDelete && (
        <DeleteCheck
          message={`Do you want to delete user "${userToDelete.email}"?`}
          onConfirm={handleDeleteUser}
          onCancel={() => setUserToDelete(null)}
        />
      )}

      <AddUserForm
        userEmail={email}
        userPassword={password}
        userRole={role}
        error={addUserError}
        isSubmitting={isSubmitting || isAddingUser}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onRoleChange={setRole}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
