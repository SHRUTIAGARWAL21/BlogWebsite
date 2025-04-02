import { format, formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
export default function Blog({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
}) {
  return (
    <div className="blog-post">
      <div className="blog-image">
        <Link to={`/post/${_id}`}>
          {" "}
          <img src={`http://localhost:4000/${cover}`} alt="Coffee" />
        </Link>
      </div>

      <div className="blog-texts">
        <Link to={`/post/${_id}`}>
          <h2 className="blog-title">{title}</h2>
        </Link>

        <p className="blog-author">{author.username}</p>
        <time className="blog-time">{formatISO9075(new Date(createdAt))}</time>
        <p className="blog-summary">{summary}</p>
      </div>
    </div>
  );
}
