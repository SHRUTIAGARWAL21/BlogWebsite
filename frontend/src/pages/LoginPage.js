import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import NavBar from "../NavBar";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext); // Get setUser function
  const navigate = useNavigate();

  async function login(ev) {
    ev.preventDefault();

    const apiUrl = process.env.REACT_APP_API_URL;
    console.log(apiUrl);

    const response = await fetch(`${apiUrl}/user/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    console.log(response);

    if (response.ok) {
      response.json().then((userInfo) => {
        setUser(userInfo);
        navigate("/blogs");
      });
    } else {
      alert("wrong credentials");
    }
  }

  return (
    <>
      <NavBar />
      <div className="login-container">
        <div className="login-box">
          {/* Left Side: Welcome Message */}
          <div className="welcome-section">
            <h1>Welcome Back!</h1>
          </div>

          {/* Right Side: Login Form */}
          <form className="login" onSubmit={login}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              autoComplete="off"
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}
