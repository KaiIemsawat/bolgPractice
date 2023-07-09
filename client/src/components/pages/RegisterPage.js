import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function submitHandler(e) {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/register", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
            alert("Registration Successful");
        } else {
            alert("Failed to register");
        }
    }
    return (
        <form className="register" onSubmit={submitHandler}>
            <h1>register</h1>
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
            <button>register</button>
        </form>
    );
}
