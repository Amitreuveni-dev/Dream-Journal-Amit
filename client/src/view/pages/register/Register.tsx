import React, { useContext, useState } from "react";
import { useNavigate } from "react-router"
import { AuthContext } from "../../Context/AuthContext";
import styles from "./Register.module.scss";


const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { register } = useContext(AuthContext);

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

        if (!validateEmail) {
            setError("Email is not valid");
            return;
        }

        try {
            await register(form.name, form.email, form.password);

            setSuccess("Login successful! Redirecting to home page...");

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
                <p>Have an account click here to Login</p>
                <p>⬇️⬇️⬇️</p>
                <button className={styles.signInButton} onClick={() => navigate("/login")}>Sign in</button>
            </form>
        </div>
    )
}

export default Register
