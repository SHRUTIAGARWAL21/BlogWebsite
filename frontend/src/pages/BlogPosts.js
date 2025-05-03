import Blog from "../Blog";
import { useEffect, useState } from "react";

export default function BlogPosts({ searchTerm }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const delayDebounce = setTimeout(() => {
      const fetchPosts = async () => {
        const endPoint = searchTerm
          ? `${apiUrl}/post/search?q=${encodeURIComponent(searchTerm)}`
          : `${apiUrl}/post/post`;

        try {
          const res = await fetch(endPoint, { signal });
          const data = await res.json();
          setPosts(data);
        } catch (err) {
          if (err.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            console.error("Failed to fetch posts", err);
          }
        }
      };

      fetchPosts();
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(delayDebounce);
      controller.abort(); // cancel previous fetch
    };
  }, [apiUrl, searchTerm]);

  return (
    <>
      {posts.length > 0 ? (
        posts.map((post) => <Blog key={post._id} {...post} />)
      ) : (
        <p>No posts found</p>
      )}
    </>
  );
}
