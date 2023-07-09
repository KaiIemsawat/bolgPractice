import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    useEffect(() => {
        fetch("http://localhost:8000/profile", {
            credentials: "include", // ! to get credentials
        }).then((response) => {
            response.json().then((userInfo) => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    /* Will also reset user / also check in backend */
    function logoutHandler() {
        fetch("http://localhost:8000/logout", {
            credentials: "include",
            method: "POST",
        });
        setUserInfo(null);
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link className="logo" to="/">
                My Blog
            </Link>
            <nav>
                {username ? (
                    <>
                        <Link to="/create">Create new post</Link>
                        <a onClick={logoutHandler}>logout</a>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
