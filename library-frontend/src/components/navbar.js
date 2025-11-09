import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.title}>📚 Library System</h2>
      <div>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/members" style={styles.link}>Members</Link>
        <Link to="/books" style={styles.link}>Books</Link>
        <Link to="/borrow" style={styles.link}>Borrow</Link>
        <Link to="/return" style={styles.link}>Return</Link>
        <Link to="/reservations" style={styles.link}>Reservations</Link>
        <Link to="/utilities" style={styles.link}>Utilities</Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
    color: "white",
    padding: "10px 25px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
  },
  title: {
    margin: 0,
  },
  link: {
    margin: "0 12px",
    color: "white",
    textDecoration: "none",
    fontWeight: 500,
  },
};

<button
  onClick={() => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  }}
  className="ml-4 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
>
  Logout
</button>

export default Navbar;
