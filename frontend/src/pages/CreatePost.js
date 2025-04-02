import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor.js";
import { Link } from "react-router-dom";
import NavBar from "../NavBar.js";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function CreateNewPost(ev) {
    ev.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("files", files[0]);

    const response = await fetch(`${apiUrl}/post/post`, {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/blogs"} />;
  }

  return (
    <>
      <NavBar />
      <div className="create-post-container">
        <form onSubmit={CreateNewPost} className="create-post-form">
          <h2 className="create-post-title">Create a New Post</h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            className="create-post-input"
          />

          <input
            type="text"
            placeholder="Summary"
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)}
            className="create-post-input"
          />

          <input
            type="file"
            onChange={(ev) => setFiles(ev.target.files)}
            className="create-post-file"
          />

          <Editor value={content} onChange={setContent} />
          <button className="create-post-button">Post</button>
        </form>
      </div>
    </>
  );
}
