// LoginPage.jsx

import React, { useState } from "react";
import "./Login.css";
import { signInWithGoogle, supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import GoogleButton from 'react-google-button'

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Display error message if login fails
      setError(error.message);
      setLoading(false);
    } else {
      console.log(data.user);
      navigate("/home");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {loading && (
        <div className="modal-overlay">
          <div
            className="spinner-container"
          >
            <InfinitySpin
              visible={true}
              width="200"
              ariaLabel="infinity-spin-loading"
              color="rgba(73, 76, 212, 1)"
            />
          </div>
        </div>
      )}
      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>
          <div style={{justifyContent:"center", display:"flex"}}>
            <GoogleButton onClick={signInWithGoogle} >Sign-In With Google</GoogleButton>
          </div>
          {error && <p className="error-message">{error}</p>}
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="login-link">
            Don't have an account? <Link href="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
