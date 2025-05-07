import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import NavBar from "./homepage/NavBar";
import Editor from "../Editor";

export default function EditPost() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [cover, setCover] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      });
    });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("files", files?.[0]);
    }

    const wordCount = summary.trim().split(/\s+/).length;

    if (wordCount > 100) {
      alert("Summary must be 100 words or less.");
      return;
    }

    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const response = await fetch(`${apiUrl}/post/post`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setRedirect(true);

      setRedirect(true);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <>
      <NavBar />
      <div className="create-post-container">
        <form onSubmit={updatePost} className="create-post-form">
          <h2 className="create-post-title">Update Post</h2>

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

          <button className="create-post-button">Update Post</button>
        </form>
      </div>
    </>
  );
}
