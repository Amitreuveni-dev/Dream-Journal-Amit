import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import styles from "./Login.module.scss"
const Login = () => {

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const { login } = useContext(AuthContext);

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(form.email, form.password);

            navigate("/")

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setError(`${error.message}, Invalid credentials`)
        }
    }
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Login</h2>

            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>

                <input type="text" name="email" placeholder="example123@gmail.com" className={styles.input} value={form.email} onChange={handleChange} required autoFocus />
                <input type="password" name="password" placeholder="123456789" className={styles.input} value={form.password} onChange={handleChange} required />
                <button type="submit" className={styles.submitButton}>Sign In</button>
                <p>Don't have an account yet</p>
                <p>Click here to Sign Up</p>
                <button className={styles.signUpButton} onClick={() => navigate("/register")}>Sign Up</button>
            </form>
        </div>
    )
}

export default Login
