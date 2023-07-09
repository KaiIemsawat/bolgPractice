// to create text editor-like form
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePostPage() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState();

    const nav = useNavigate();

    async function createPostHandler(e) {
        const data = new FormData();
        data.set("title", title);
        data.set("summary", summary);
        data.set("content", content);
        data.set("file", files[0]);

        e.preventDefault();

        const response = await fetch("http://localhost:8000/post", {
            method: "POST",
            body: data,
            credentials: "include",
        });
        // console.log(await response.json());
        if (response.ok) {
            nav("/");
        }
    }

    return (
        <form onSubmit={createPostHandler}>
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
            <button style={{ marginTop: "5px" }}>Create Post</button>
        </form>
    );
}
