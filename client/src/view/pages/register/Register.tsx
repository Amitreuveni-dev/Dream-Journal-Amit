import { useNavigate } from "react-router"

const Register = () => {
    const navigate = useNavigate();

    function handleRegister() {
        setTimeout(() => {
            navigate("login");
        }, 2000)
    }
    return (
        <div>
            <h1>Register</h1>
            <form name="registerForm">
                <input type="text" name="name" placeholder="Your name" required autoFocus />
                <input type="text" name="email" placeholder="example@gmail.com" required />
                <input type="password" name="password" placeholder="0123456789" required />
                <button type="submit" onClick={handleRegister}>Register</button>
            </form>
        </div>
    )
}

export default Register
