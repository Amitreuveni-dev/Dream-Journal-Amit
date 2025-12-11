import { useState } from "react";
import { useNavigate } from "react-router"
import styles from "./Register.module.scss";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { authService } from "../../services/authService";
import { registerSuccess } from "../../redux/slices/authSlice";


const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });


    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        setError("");
        setSuccess("");
    }

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateEmail(form.email)) {
            setError("Email is not valid");
            return;
        }

        try {
            const res = await authService.register(form.name, form.email, form.password);

            dispatch(registerSuccess(res.user))

            setSuccess("Registration successeful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 2000)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setError(error.message)
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Sign Up</h2>

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}


            <form onSubmit={handleSubmit} className={styles.form}>

                <input type="text" name="name" placeholder="Your name" className={styles.input} value={form.name} onChange={handleChange} required autoFocus />
                <input type="text" name="email" placeholder="example@gmail.com" className={styles.input} value={form.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="0123456789" className={styles.input} value={form.password} onChange={handleChange} required />
                <button type="submit" className={styles.submitButton}>Create Account</button>
                <p>Have an account? Click below</p>
                <p>⬇️⬇️⬇️</p>
                <button className={styles.signInButton} onClick={() => navigate("/login")}>Sign in</button>
            </form>
        </div>
    )
}

export default Register
