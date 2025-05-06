import { formatISO9075 } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import NavBar from "../NavBar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa6";
import { FcLikePlaceholder } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa";
import "../Css/postpage.css";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  // Fetch post info including like data
  useEffect(() => {
    fetch(`${apiUrl}/post/post/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPostInfo(data);
        setLiked(data.isLiked);
        setLikes(data.likeCount || 0);
      })
      .catch((err) => console.error("Error fetching post:", err));
  }, [id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${apiUrl}/post/comments/${id}`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [id]);

  // Toggle like handler
  const toggleLike = async () => {
    try {
      const res = await fetch(`${apiUrl}/post/like/${id}`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();

        setLiked(data.isLiked);
        setLikes(data.likeCount);
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    try {
      const res = await fetch(`${apiUrl}/post/addComment/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prevComments) => [data, ...prevComments]);
        setNewComment(""); // Reset comment input
      }
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  // Delete post handler
  const handleDelete = async () => {
    try {
      const res = await fetch(`${apiUrl}/post/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        navigate(`/myprofile/${user.id}`);
      } else {
        console.error("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (!postInfo) return <div className="loading">Loading...</div>;

  return (
    <>
      <NavBar />
      <div className="post-card">
        <div className="post-left">
          <div className="post-header">
            <h1 className="post-title">{postInfo.title}</h1>
            {user && user.id === postInfo.author._id && (
              <>
                <BsThreeDotsVertical
                  className="options-icon"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="dropdown-box">
                    <button className="delete-button" onClick={handleDelete}>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <time className="post-time">
            {formatISO9075(new Date(postInfo.createdAt))}
          </time>
          <div className="author">by @{postInfo.author.username}</div>
          {user && user.id === postInfo.author._id && (
            <div className="edit-container">
              <Link to={`/edit/${postInfo._id}`} className="edit-link">
                Edit this post
              </Link>
            </div>
          )}
          <img
            className="post-img"
            src={`${apiUrl}/${postInfo.cover}`}
            alt={postInfo.title}
          />
          <div className="summary">
            <h3>Summary:</h3>
            <p>{postInfo.summary}</p>
          </div>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: postInfo.content }}
          ></div>
        </div>

        <div className="post-right">
          <div className="comment-section">
            <h3 className="comment-heading">Comments</h3>
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet.</p>
            ) : (
              <ul className="comments-list">
                {comments.map((c) => (
                  <p className="comment">
                    <strong>{c.author.username}</strong> {c.content}
                  </p>
                ))}
              </ul>
            )}
            <hr className="separator" />
          </div>

          <div className="interaction-container">
            <div className="interaction-bar">
              <button onClick={toggleLike} className="like-button">
                {liked ? <FcLikePlaceholder /> : <FaRegHeart />}
              </button>
              <div className="like-count">{likes} Likes</div>
              <button className="comment-button">
                <FaRegComment />
              </button>
            </div>

            <div className="comment-input">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleCommentSubmit}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
