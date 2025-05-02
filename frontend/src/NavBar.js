import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  const location = useLocation(); // Get the current route

  return (
    <nav className="nav-bar">
      <Link to="/">Home</Link>
      <Link to="/blogs">Blog</Link>
      {user ? (
        <>
          <button className="logout-header" onClick={logout}>
            Logout
          </button>
          <Link to={`/myprofile/${user.id}`}>
            {user.username.charAt(0).toUpperCase()}
          </Link>
        </>
      ) : (
        <>
          {/* Hide Login button on /login route */}
          {location.pathname !== "/login" && <Link to="/login">Login</Link>}
          {/* Hide Register button on /register route */}
          {location.pathname !== "/register" && (
            <Link to="/register">Register</Link>
          )}
        </>
      )}
    </nav>
  );
}
