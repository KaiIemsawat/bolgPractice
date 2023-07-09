import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setUserInfo } = useContext(UserContext);
    const nav = useNavigate();

    async function loginHandler(e) {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: { "Content-Type": "application/json" },
            credentials: "include", // ! <-- important to follow for getting jwt cookies
        });
        if (response.ok) {
            // console.log(response);
            response.json().then((userInfo) => {
                setUserInfo(userInfo);
                // console.log(userInfo.username);
                alert(`Welcome, ${userInfo.username}`);
                nav("/");
            });
        } else {
            alert("invalid credentials!!");
            // console.log(response);
        }
    }
    return (
        <form className="login" onSubmit={loginHandler}>
            <h1>login</h1>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button>login</button>
        </form>
    );
}
