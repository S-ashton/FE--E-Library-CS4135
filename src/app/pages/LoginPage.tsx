import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import type { AppDispatch } from "../store/store";
import { login } from "../store/authSlice";
import { registerUser } from "../store/usersSlice";
import { validateEmail, validatePassword } from "../utils/validation";
import AuthCard from "../components/ui/AuthCard/AuthCard.tsx";
import "./loginPage.css";
import LoginForm from "../components/ui/LoginForm/LoginForm.tsx";
import RegisterForm from "../components/ui/RegisterForm/RegisterForm.tsx";

type Mode = "login" | "register";

function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFieldError, setEmailFieldError] = useState("");
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const goToRegister = () => {
    setMode("register");
    setError("");
    setEmailFieldError("");
    setPasswordFieldErrors([]);
  };

  const goToLogin = () => {
    setMode("login");
    setError("");
    setEmailFieldError("");
    setPasswordFieldErrors([]);
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (typeof err === "string") {
        setError(err);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setEmailFieldError("");
    setPasswordFieldErrors([]);

    if (!email.trim()) {
      setEmailFieldError("Email is required.");
      return;
    }
    const emailResult = validateEmail(email);
    if (!emailResult.valid) {
      setEmailFieldError(emailResult.message);
      return;
    }

    if (!password.trim()) {
      setPasswordFieldErrors(["Password is required."]);
      return;
    }
    const pw = validatePassword(password);
    if (!pw.valid) {
      setPasswordFieldErrors(pw.messages);
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        registerUser({
          email: email.trim(),
          password,
          role: "USER",
        })
      ).unwrap();
      await dispatch(login({ email: email.trim(), password })).unwrap();
      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (typeof err === "string") {
        setError(err);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-layout">
        <section className="login-form-panel">
          <div className="login-form-content">
            <div className="login-brand">
              <div className="login-brand-mark">📘</div>
              <span className="login-brand-text">E-Library</span>
            </div>

            <div className="login-card-wrap">
              <AuthCard
                title={mode === "login" ? "Welcome back" : "Create an account"}
                subtitle={
                  mode === "login"
                    ? "Sign in to continue to E-Library."
                    : "Use a strong password — requirements appear if needed."
                }
              >
                {mode === "login" ? (
                  <LoginForm
                    email={email}
                    password={password}
                    error={error}
                    isSubmitting={loading}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onSubmit={handleLoginSubmit}
                    onTrySignInAgain={() => setError("")}
                    onChooseRegister={goToRegister}
                  />
                ) : (
                  <RegisterForm
                    email={email}
                    password={password}
                    error={error}
                    emailFieldError={emailFieldError}
                    passwordFieldErrors={passwordFieldErrors}
                    isSubmitting={loading}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onSubmit={handleRegisterSubmit}
                    onBackToSignIn={goToLogin}
                  />
                )}
              </AuthCard>
            </div>
          </div>
        </section>

        <aside className="login-visual-panel">
          <div className="login-visual-content">
            <div className="login-visual-badge">Library access made simple</div>

            <h2 className="login-visual-title">
              Borrow, manage, and discover books with ease.
            </h2>

            <p className="login-visual-text">
              A cleaner, calmer way to access your library dashboard, catalogue,
              and loan activity.
            </p>

            <div className="login-illustration">
              <div className="login-glow login-glow-one" />
              <div className="login-glow login-glow-two" />

              <div className="login-mock-card">
                <div className="login-mock-header" />
                <div className="login-mock-body">
                  <div className="login-mock-book" />
                  <div className="login-mock-lines">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>

              <div className="login-floating-chip login-chip-one">Available</div>
              <div className="login-floating-chip login-chip-two">Borrowed</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default LoginPage;
