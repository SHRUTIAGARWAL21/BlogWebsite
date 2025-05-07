import React from "react";

import {
  FaFacebookF,
  FaPinterestP,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <div>
      <div className="footer-quote">
        "Every story matters. Start writing yours today."
      </div>
      <footer className="footer">
        <div className="social-icons">
          <a href="#">
            <FaFacebookF />
          </a>
          <a href="#">
            <FaPinterestP />
          </a>
          <a href="#">
            <FaInstagram />
          </a>
          <a href="#">
            <FaTwitter />
          </a>
        </div>

        <nav className="footer-nav">
          <a href="#">Home</a>
          <a href="#">menu</a>
          <a href="#">Stroy</a>
          <a href="#">Locations</a>
        </nav>

        <div className="footer-buttom">
          <p>© Blog Website | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
