import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import NavBar from "./NavBar";
import "../../Css/homePage.css";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <header className="header">
        <h1 className="title">EchoWrite</h1>
        <h3 className="subtitle">Your thoughts, echoed</h3>
      </header>

      <section className="hero">
        <NavBar />
        <h3 className="quote">"Write what should not be forgotten."</h3>
        <p className="quote-author">- Isabel Allende</p>
      </section>
    </div>
  );
}
