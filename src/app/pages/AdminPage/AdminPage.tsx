import { useEffect } from "react";
import UsersTable from "../../components/ui/UsersTable/UsersTable";
import { useGetUsers } from "../../hooks/useGetUers";
import AddUserForm from "../../components/ui/AddUsersForm/AddUsersForm";
import { useAddUser } from "../../hooks/useAddUser";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { registerUser } from "../../store/usersSlice";
import { useToast } from "../../hooks/useToast";

export default function AdminPage() {
  const { users, isLoading, error, refreshUsers } = useGetUsers();
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();

  const { isAddingUser } = useAppSelector((state) => state.users);

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

      <UsersTable users={users} isLoading={isLoading} error={error} />

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