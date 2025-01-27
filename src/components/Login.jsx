import React, { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "../index.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            console.log("Login response:", data);
            if (data.userType === "Student") {
                navigate(`/student/${data.userId}`);
            } else if (data.userType === "Teacher") {
                navigate(`/teacher/${data.userId}`);
            } else {
                throw new Error("Invalid UserType");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "An error occurred during login");
        }
    };

    return (
        <div className="login-container">
            <img
                src="src/image.png"
                alt="Astana IT University"
                className="login-logo"/>
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"/>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"/>
                <button type="submit" className="login-button">
                    Login
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
