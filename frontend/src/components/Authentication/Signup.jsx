import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import { supabase } from '../../supabaseClient';

function Signup() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [name,setName] = useState('');
  const [error,setError] = useState(null);

  const handleSignup = async (e)=>{
    e.preventDefault();

    if(!name || !email || !password){
      setError('Please fill in all fields');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setError(error.message);
    }


      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          full_name: name,
          email: email,
          created_at: new Date().toISOString()
        }
      ])
      if(profileError){
        setError(error.message);
      } else{
        setError('Confirm you email to login');
        console.log(data.user);
      }

  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="signup-title">Sign Up</h1>
          {error && <p className="error-message">{error}</p>}
          <form className="signup-form" onSubmit={handleSignup}>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input type="text"value={name} id="name" placeholder="Enter your name" onChange={e => setName(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" value={email} id="email" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" value={password} id="password" placeholder="Enter your password" onChange={e => setPassword(e.target.value)} required/>
            </div>
            <button type='submit' className="signup-btn">Sign Up</button>
          </form>
          <div className="login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
