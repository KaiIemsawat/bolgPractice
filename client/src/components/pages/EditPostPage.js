import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Editor from "../Editor";

export default function EditPostPage() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState();

    const nav = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8000/post/${id}`).then((response) => {
            response.json().then((postInfo) => {
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
            });
        });
    }, []);
    async function updatePostHnadler(e) {
        e.preventDefault();
        const data = new FormData();
        data.set("title", title);
        data.set("summary", summary);
        data.set("content", content);
        data.set("id", id);
        if (files?.[0]) {
            data.set("file", files?.[0]);
        }

        const response = await fetch("http://localhost:8000/post", {
            method: "PUT",
            body: data,
            credentials: "include",
        });
        if (response.ok) {
            nav(`/post/${id}`);
        }
    }

    return (
        <form onSubmit={updatePostHnadler}>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                name="summary"
                placeholder="Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
            />
            <input
                type="file"
                // value={files} // ! do not use value={} when working with file
                onChange={(e) => setFiles(e.target.files)}
            />
            <Editor onChange={setContent} value={content} />
            <button style={{ marginTop: "5px" }}>Update Post</button>
        </form>
    );
}
