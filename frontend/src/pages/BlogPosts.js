import Blog from "../Blog";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${apiUrl}/post/post`).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);

  return <>{posts.length > 0 && posts.map((post) => <Blog {...post} />)}</>;
}
