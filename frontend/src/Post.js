import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

export default function Post({
  _id,
  title,
  summary,
  cover,
  createdAt,
  author,
}) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={`${apiUrl}/${cover}`} alt={title} />
        </Link>
      </div>

      <div className="texts">
        <Link to={`/post/${_id}`}>{title}</Link>
      </div>
    </div>
  );
}
