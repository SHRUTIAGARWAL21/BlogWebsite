import { useEffect, useState } from "react";
import Post from "../Post";

export default function IndexPage() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Fetch posts from API
    fetch(`${apiUrl}/post/post`)
      .then((response) => response.json())
      .then((posts) => {
        // Sort posts by the updated time or timestamp field (assume updatedAt)
        const sortedPosts = posts.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        // Get only the top 5 most recent posts
        setPosts(sortedPosts.slice(0, 5));
      });

    // Set categories data
    const categoriesData = [
      {
        name: "Every canvas is a journey all its own",
        image:
          "https://static.vecteezy.com/system/resources/thumbnails/006/983/499/small_2x/trendy-mid-century-modern-aesthetic-one-line-art-illustration-free-vector.jpg",
        description:
          "Explore a world of creative expression through paintings, sculptures, and various art forms.",
      },
      {
        name: "Pages are windows to new worlds",
        image:
          "https://img.freepik.com/premium-photo/book-flowers_1048944-11382944.jpg",
        description:
          "Dive into a collection of books across various genres, from fiction to non-fiction.",
      },
      {
        name: "Good food is good mood.",
        image:
          "https://i.pinimg.com/736x/90/82/6e/90826e8f608c127fbc3411b34bb3287f.jpg",
        description:
          "Discover mouth-watering recipes, cooking tips, and food culture from around the world.",
      },
      {
        name: "Innovation in every click.",
        image:
          "https://www.shutterstock.com/image-photo/flatlay-person-hands-working-on-600nw-2085739492.jpg",
        description:
          "Stay updated with the latest in technology, gadgets, and innovations shaping the future.",
      },
      {
        name: "Wanderlust is a way of life",
        image:
          "https://favim.com/pd/p/orig/2018/09/08/aesthetic-travel-traveling-Favim.com-6277248.jpg",
        description:
          "Explore travel destinations, tips, and adventures for your next vacation or journey.",
      },
    ];

    setCategories(categoriesData);
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <>
      {/* <h2>Featured from Blog</h2>
      {posts.length > 0 && posts.map((post) => <Post {...post} />)} */}
      <div className="heading">
        <h2 className="main-title">Featured</h2>
        <h3 className="sub-main-title">FROM THE BLOG</h3>
      </div>
      <div className="post-container">
        <div className="featured-posts">
          {posts.length > 0 && posts.map((post) => <Post {...post} />)}
        </div>
      </div>
      <div className="categories-container">
        {categories.map((category, index) => (
          <div
            className={`category-item ${
              index % 2 === 0 ? "left-right" : "right-left"
            }`}
            key={index}
          >
            <img
              src={category.image}
              alt={category.name}
              className="category-image"
            />
            <div className="category-content">
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
