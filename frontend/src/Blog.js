import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa6";
import { FcLikePlaceholder } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa";

import { useState } from "react";

export default function Blog({
  _id,
  title,
  summary,
  cover,
  createdAt,
  author,
  isLiked,
  likeCount,
  commentCount,
}) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);
  const [comments, setComments] = useState(commentCount);

  const toggleLike = async () => {
    try {
      const res = await fetch(`${apiUrl}/post/like/${_id}`, {
        method: "POST",
        credentials: "include", // Make sure to include cookies with the request
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

  return (
    <div className="blog-post">
      <div className="blog-image">
        <Link to={`/post/${_id}`}>
          <img src={`${apiUrl}/${cover}`} alt="cover" />
        </Link>
      </div>

      <div className="blog-texts">
        <Link to={`/post/${_id}`}>
          <h2 className="blog-title">{title}</h2>
        </Link>
        <p className="blog-author">{author.username}</p>
        <time className="blog-time">{formatISO9075(new Date(createdAt))}</time>
        <p className="blog-summary">{summary}</p>

        <div className="blog-icons flex items-center gap-2 mt-2">
          <button onClick={toggleLike}>
            {liked ? <FcLikePlaceholder /> : <FaRegHeart />}
          </button>
          <span>{likes} likes</span>
        </div>
        <Link to={`/post/${_id}`}>
          <FaRegComment />
          <h6>View all {comments} comments</h6>
          <h6>Add a comment...</h6>
        </Link>
      </div>
    </div>
  );
}
