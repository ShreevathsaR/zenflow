import React, { useEffect, useState } from "react";
import "./Page.css";
import Inbox from "./Inbox/Inbox";
import { usePageContext } from "../Contexts/PageContext";
import OrganizationHome from "../Organization/OrganizationHome";
import KanbanHome from "./Kanban/KanbanHome";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../Contexts/NotificationContext";
import { io } from "socket.io-client";

const Page = () => {
  const { page } = usePageContext();
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);

  const [userId, setUserId] = useState(null);

  const { notifications, setNotifications } = useNotifications();

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    newSocket.on("connection", () => {
      console.log("Connected to server");
    });
    
    newSocket.on("notification", (data) => {
      console.log(data);
      setNotifications((prev) => [...prev, data]);
    });
    
    getUser(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const org_id = sessionStorage.getItem("orgId");
    console.log(org_id);

    const getSession = async () => {
      const session = await supabase.auth.getSession();
      console.log(session.data.session.user);
      if (!session) {
        navigate("/login");
        return;
      }
      addGoogleUserToDatabase(session.data.session.user, org_id);
    };
    getSession();
  }, []);

  const getUser = async (newSocket) => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log(error);
    } else {
      setUserId(data.user.id);
      if(newSocket){
        newSocket.emit("register", data.user.id);
      } else {
        console.log('Could not register user');
      }
    }
  };

  const sendMessage = () => {
    socket.emit("notification", "Message");
  };

  const addGoogleUserToDatabase = async (user, org_id) => {
    const { id, email, user_metadata } = user;
    const full_name = user_metadata?.full_name || "";
    const avatar_url = user_metadata?.avatar_url || "";

    try {
      // Check if the user already exists
      const { count, error: fetchError } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("id", id);

      if (fetchError) {
        console.error("Error fetching user:", fetchError.message);
        return;
      }

      if (count > 0) {
        // User exists
        console.log("User exists so not adding him... :)");
      } else {
        // User doesn't exist
        console.log("User does not exist");
        insertHisData(id, full_name, email, avatar_url, org_id);
      }
    } catch (error) {
      console.error("Error during database operation:", error.message);
    }
  };

  const insertHisData = async (id, full_name, email, avatar_url, org_id) => {
    try {
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id,
          full_name,
          email,
          avatar_url,
          created_at: new Date(),
        },
      ]);

      if (insertError) {
        console.error("Error inserting profile:", insertError.message);
      } else {
        console.log("Profile created successfully");
        if (org_id) {
          console.log("So this is an invite link putting him in the org");
          putHimInTheOrg(id, org_id);
        } else {
          console.log("A regular Signup...");
          navigate("/onboard");
        }
      }
    } catch (error) {
      console.error("Error during database operation:", error.message);
    }
  };

  const putHimInTheOrg = async (id, org_id) => {
    console.log(org_id);

    try {
      const { data: insertionData, error } = await supabase
        .from("userorganizations")
        .insert({
          user_id: id,
          organization_id: org_id,
          role: "Member",
        })
        .select();

      if (error) {
        console.log(error);
        return;
      }

      console.log("Adding user to org from google auth place ", insertionData);

      navigate("/onboard");
    } catch (error) {
      console.error("Error during the org database operation:", error.message);
    }
  };

  return (
    <div className="page">
      {page === "" && (
        <div
          style={{
            color: "white",
            fontSize: "x-large",
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Select a tool
          <button onClick={sendMessage}>Send message</button>
        </div>
      )}
      {page === "Notes" && <KanbanHome socket={socket} />}
      {page === "Inbox" && <Inbox />}
      {page === "OrganizationHome" && <OrganizationHome />}
    </div>
  );
};

export default Page;
