import {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import type {AppDispatch} from "../../store/store";
import {login} from "../../store/authSlice";
import {validateEmail, validatePassword} from '../../utils/validation';
import type { FormEvent } from "react";

function LoginPage() {
    // useDispatch is typed with AppDispatch so TypeScript knows about async thunks.
    // Without the type argument, dispatch would not accept thunks as arguments.
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailFieldError, setEmailFieldError] = useState<string>('');
    const [passwordFieldErrors, setPasswordFieldErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const validateEmailField = (): boolean => {
        setEmailFieldError('');

        if (!email || email.trim() === '') {
            setEmailFieldError("Email is required.");
            return false;
        }
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            setEmailFieldError(emailValidation.message);
            return false;
        }
        return true;
    }

    const validatePasswordField = (): boolean => {
        setPasswordFieldErrors([]);

        if (!password || password.trim() === '') {
            setPasswordFieldErrors(["Password is required."]);
            return false;
        }
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            setPasswordFieldErrors(passwordValidation.messages);
            return false;
        }
        return true;
    }

    const handleLoginFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const emailIsValid = validateEmailField();
        const passwordIsValid = validatePasswordField();

        if (!emailIsValid || !passwordIsValid) {
            return;
        }

        setLoading(true);

        try {
            // dispatch(login(...)) fires the login thunk and returns a promise.
            // .unwrap() extracts the fulfilled value or throws the rejected value,
            // so we can handle success and failure with a normal try/catch.
            await dispatch(login({ email, password })).unwrap();
            navigate('/dashboard', { replace: true });
        } catch (err: unknown) {
            console.log('catch block ran', err);
            // The login thunk uses rejectWithValue to pass the error message as a string.
            // .unwrap() throws that string directly, so we check typeof before using it.
            // The else branch handles unexpected non-string errors (e.g. network failure
            // where the thunk falls back to a generic message).
            if (typeof err === 'string') {
                setError(err);
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            // finally always runs — ensures loading is reset even if navigation
            // or an unexpected error occurs after the dispatch.
            setLoading(false);
        }
    }

    return (
        <>
            <h1>Sign in</h1>
            <form onSubmit={handleLoginFormSubmit} noValidate>
                {error && <span>{error}</span>}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    placeholder="E-mail"
                />
                {emailFieldError && <span>{emailFieldError}</span>}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    placeholder="Password"
                />
                {passwordFieldErrors.length > 0 && (
                    <ul>
                        {passwordFieldErrors.map((err) => (
                            <li key={err}>{err}</li>
                        ))}
                    </ul>
                )}
                <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
            </form>
        </>
    )
}

export default LoginPage;
