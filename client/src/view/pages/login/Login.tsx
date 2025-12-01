import { useNavigate } from "react-router";
const Login = () => {

    const navigate = useNavigate();

    function handleLogin() {
        setTimeout(() => {
            navigate("/")
        }, 2000);
    }
    return (
        <div>
            <h1>Login</h1>
            <form name="loginForm">
                <input type="text" name="email" placeholder="example123@gmail.com" required autoFocus />
                <input type="password" name="password" placeholder="123456789" required />
                <button type="submit" onClick={handleLogin}></button>
            </form>
        </div>
    )
}

export default Login
