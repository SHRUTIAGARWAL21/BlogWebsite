import { useState } from "react";
import NavBar from "./homepage/NavBar";
import { Link } from "react-router-dom";
import "../Css/loginPage.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function register(ev) {
    ev.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;
    const response = await fetch(`${apiUrl}/user/register`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("registration successfull");
    } else {
      alert("registration failed");
    }
  }

  return (
    <>
      <NavBar />

      <div className="register-container">
        <div className="register-box">
          <div className="welcome-section">
            <h1>New Here? Register to Begin</h1>
          </div>
          <form className="register" onSubmit={register}>
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
            />

            <button>Register</button>
            <div className="register-inline">
              <h2>Already registered ?</h2>
              <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
