import React, { useEffect, useState } from "react";
import PostPage from "./PostPage";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8000/post").then((response) => {
            response.json().then((posts) => {
                setPosts(posts);
            });
        });
    }, []);
    return (
        <div>
            {posts.length > 0 &&
                posts.map((eachPost) => <PostPage {...eachPost} />)}
        </div>
    );
}
