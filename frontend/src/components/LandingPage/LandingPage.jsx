import React, { useEffect } from "react";
import "./LandingPage.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    getSession();
  }, []);

  const getSession = async () => {
    const session = await supabase.auth.getSession();

    if (session.data.session === null) {
      console.log("No session");
    } else {
      navigate("/home");
      console.log(session.data.session);
    }
  };

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo">ZenFlow</div>
        <ul>
          <li>
            <a href="#">Features</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        <div className="nav-auth-buttons">
          <button
            className="nav-button">
            <Link to="/login">Login</Link>
          </button>
          <button className="nav-button">
            <Link to="/signup">Sign Up</Link>
          </button>
        </div>
      </nav>

      <div className="hero-section">
        <h1 className="title">ZenFlow</h1>
        <p className="tagline">
          Your Collaborative Workspace for Seamless Teamwork
        </p>
        <button className="get-started-btn">
          <Link to="/signup" style={{ textDecoration: "none", color: "white" }}>
            Get Started
          </Link>
        </button>
      </div>

      <section className="features">
        <div className="feature-card">
          <h3>Kanban Notes</h3>
          <p>Organize your tasks visually with our Kanban-style notes.</p>
          <img
            className="feature-image"
            src="/Kanban Board.png"
            alt="Kanban Notes"
          />
        </div>
        <div className="feature-card">
          <h3>Advanced Todo List</h3>
          <p>
            Manage your tasks efficiently with our advanced Todo list features.
          </p>
          <img className="feature-image" src="/Todo List.png" alt="Todo List" />
        </div>
        <div className="feature-card">
          <h3>Collaborative Whiteboard</h3>
          <p>Work together in real-time with our collaborative whiteboard.</p>
          <img
            className="feature-image"
            src="/whiteboard.svg"
            alt="Collaborative Whiteboard"
          />
        </div>
      </section>

      <section className="our-vision">
        <h2>Our Vision</h2>
        <div className="vision-content">
          <div className="vision-step">
            <h3>Step 1</h3>
            <p>Visualize your projects with our intuitive tools.</p>
            <img className="vision-image" src="path-to-image" alt="Step 1" />
          </div>
          <div className="vision-step">
            <h3>Step 2</h3>
            <p>Collaborate with your team in real-time.</p>
            <img className="vision-image" src="path-to-image" alt="Step 2" />
          </div>
          <div className="vision-step">
            <h3>Step 3</h3>
            <p>Track progress and achieve your goals.</p>
            <img className="vision-image" src="path-to-image" alt="Step 3" />
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-card">
          <p>
            "ZenFlow has transformed the way we collaborate. Highly
            recommended!"
          </p>
          <p>- Jane Doe, Project Manager</p>
        </div>
        <div className="testimonial-card">
          <p>
            "The best tool for team productivity. We love the whiteboard
            feature!"
          </p>
          <p>- John Smith, Software Engineer</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 ZenFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
