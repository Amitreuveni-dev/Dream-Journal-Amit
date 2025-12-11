import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Login.module.scss"
import { loginSuccess } from "../../redux/slices/authSlice";
import type { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { authService } from "../../services/authService";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const dispatch = useDispatch<AppDispatch>();

    const [success, setSuccess] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        setError("");
        setSuccess("");
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await authService.login(form.email, form.password);

            dispatch(loginSuccess(res.user));

            setSuccess("Login successful! Redirecting...");

            setTimeout(() => {
                navigate("/");
            }, 2000)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setError(error.message)
        }
    }
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Login</h2>

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>

                <input type="text" name="email" placeholder="example123@gmail.com" className={styles.input} value={form.email} onChange={handleChange} required autoFocus />
                <input type="password" name="password" placeholder="123456789" className={styles.input} value={form.password} onChange={handleChange} required />
                <button type="submit" className={styles.submitButton}>Sign In</button>
                <p>Don't have an account yet,</p>
                <p>Click here to Sign Up</p>
                <p>⬇️⬇️⬇️</p>
                <button className={styles.signUpButton} onClick={() => navigate("/register")}>Sign Up</button>
            </form>
        </div>
    )
}

export default Login
