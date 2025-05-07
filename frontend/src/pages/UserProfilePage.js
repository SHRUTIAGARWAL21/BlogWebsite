import { useState, useEffect } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import NavBar from "./homepage/NavBar";
import Post from "../Post";

export default function UserProfilePage() {
  const { user } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("User not found");
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.error("error fetching user", err);
      }
    };

    fetchUserInfo();
  }, [apiUrl, id]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/post/searchByUser/${id}`);
        if (!response.ok) {
          throw new Error("User not found");
        }
        console.log(response);
        const data = await response.json();
        setUserPosts(data);
        console.log(data);
      } catch (err) {
        console.log("error fetching post of user", err);
      }
    };
    fetchUserPosts();
  }, [apiUrl, id]);

  return (
    <>
      <div className="profile-nav">
        <Link to="/" className="logo">
          EchoWrite
        </Link>
        <NavBar />
      </div>

      <div className="profile-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#5a3e2b"
          className="profile-svg"
        >
          <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="user-info">
        <h2>@{userInfo.username}</h2>
        <h3>Total Blogs: {userPosts.length}</h3>
      </div>

      <div className="about-user">
        <div className="post-container">
          <div className="featured-posts">
            {userPosts.length > 0 &&
              userPosts.map((post) => <Post {...post} />)}
          </div>
        </div>
      </div>
    </>
  );
}
