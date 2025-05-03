import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import BlogPosts from "./BlogPosts";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="blog-container">
      <nav className="blog-nav">
        <Link to="/" className="logo">
          EchoWrite
        </Link>
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="button-container">
          {user ? (
            <>
              <Link to="/Create" className="create">
                + Create
              </Link>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
              <Link to={`/myprofile/${user.id}`} className="profile-link">
                {user.username.charAt(0).toUpperCase()}
              </Link>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </nav>
      <section className="blog-content">
        <BlogPosts searchTerm={searchTerm} />
      </section>
    </main>
  );
}
