import { formatISO9075 } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import NavBar from "../NavBar";
import { Link } from "react-router-dom";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/post/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => setPostInfo(postInfo))
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  if (!postInfo) return <div className="loading">Loading...</div>;

  return (
    <>
      <NavBar />
      <div className="post-container">
        <h1 className="post-title">{postInfo.title}</h1>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
        <div className="author">by @{postInfo.author.username}</div>

        {user && user.id === postInfo.author._id && (
          <div>
            <Link to={`/edit/${postInfo._id}`} className="edit-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Edit this post
            </Link>
          </div>
        )}
        <img
          className="post-image"
          src={`http://localhost:4000/${postInfo.cover}`}
          alt={postInfo.title}
        />
        <div className="summary">
          <h3>Summary : </h3>
          <div>{postInfo.summary}</div>
        </div>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        />
      </div>
    </>
  );
}
