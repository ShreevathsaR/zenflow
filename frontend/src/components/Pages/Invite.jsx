import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const Invite = () => {
  const [invalidLink, setInvaildLink] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const orgId = urlParams.get("org");
    console.log(orgId);
    
    if (orgId) {
      sessionStorage.setItem("orgId", orgId);
    }
    
    if (!token && !orgId) {
      sessionStorage.setItem("orgId", orgId);
      
      const tokenValidation = async () => {
        console.log(token, orgId);
        
        const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("token", token)
        .single();
        
        if (error) {
          console.log(error);
          setInvaildLink(true);
          return;
        }
        
        if (data.length === 0) {
          console.log("Invalid token");
          setInvaildLink(true);
          return;
        }

        if (new Date(data.expires_at) < new Date()) {
          console.log("Invite has expired");
          setInvaildLink(true);
          return;
        }
        
        console.log(data);
        setInvaildLink(false);
      };
      
      tokenValidation();
    }
  }, []);
  
  return (
    <div className="onboard-page">
      {!invalidLink && (
        <div className="onboard-heading">
          <h1>You're invited to join an organization!</h1>
          <h3>Would you like to register?</h3>
          <button
            className="nav-button"
            style={{ width: "10rem", marginTop: "3rem" }}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Register
          </button>
        </div>
      )}
      {invalidLink && (
        <div className="onboard-heading">
          <h1>Invalid Link</h1>
          <h3>Please try again</h3>
        </div>
      )}
    </div>
  );
};

export default Invite;
