import React, { useEffect } from "react";
import "./Page.css";
import Todo from "./Todo/Todo";
import { usePageContext } from "../Contexts/PageContext";
import OrganizationHome from "../Organization/OrganizationHome";
import KanbanHome from "./Kanban/KanbanHome";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const Page = () => {
  const { page } = usePageContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const session = await supabase.auth.getSession();
      console.log(session.data.session.user);
      if (!session) {
        navigate("/login");
        return
      }
      addGoogleUserToDatabase(session.data.session.user)
    };
    getSession();
  }, []);

  const addGoogleUserToDatabase = async (user) => {
    const { id, email, user_metadata } = user;
    const full_name = user_metadata?.full_name || '';
    const avatar_url = user_metadata?.avatar_url || '';

    try {
      // Check if the user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching user:', fetchError.message);
      }

      // If the user does not exist, insert new user data
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id,
              full_name,
              email,
              avatar_url,
              created_at: new Date(),
            },
          ]);

        if (insertError) {
          console.error('Error inserting profile:', insertError.message);
        } else {
          console.log('Profile created successfully');
          window.location.reload();
        }
      } else {
        console.log('User already exists, skipping insertion');
      }
    } catch (error) {
      console.error('Error during database operation:', error.message);
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
        </div>
      )}
      {page === "Notes" && <KanbanHome />}
      {page === "Todo" && <Todo />}
      {page === "OrganizationHome" && <OrganizationHome />}
    </div>
  );
};

export default Page;
