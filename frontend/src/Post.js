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

//  {/* <p className="author">By {author.username}</p>
//         <time>{formatISO9075(new Date(createdAt))}</time> */}
//         {/* <p className="summary">{summary}</p> */}

// .post {
//   margin-top: 40px;
//   display: flex;
//   align-items: center;
//   margin-left: 400px;
//   gap: 20px;
//   padding: 20px;
//   border-radius: 10px;
//   box-shadow: 2px 2px 10px rgba(40, 11, 1, 0.3);
//   margin-bottom: 20px;
//   max-width: 800px;
// }

// .image {
//   flex-shrink: 0;
//   width: 200px;
//   height: 250px;
//   overflow: hidden;
// }

// .image img {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   border-radius: 100px 100px 0 0; /* Curved top, straight bottom */
// }

// .texts {
//   flex: 1;
//   color: #5c3d2e; /* Brown text */
// }

// .texts a {
//   text-decoration: none; /* Removes underline from links */
//   color: inherit; /* Keeps the color same as the parent element */
// }

// h2 {
//   font-family: "Dancing Script", cursive;
//   font-weight: bold;
//   font-size: 35px;
//   color: #5c3d2e;
// }

// .author {
//   font-weight: bold;
//   margin: 5px 0;
// }

// time {
//   display: block;
//   font-size: 14px;
//   color: #8b5e3c;
// }

// .summary {
//   margin-top: 10px;
//   line-height: 1.5;
// }
