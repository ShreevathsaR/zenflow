import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { FaUserCircle } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { usePageContext } from "../Contexts/PageContext";
import { MdDashboard } from "react-icons/md";
import { MdViewKanban } from "react-icons/md";
import { BiChalkboard } from "react-icons/bi";
import { RiTodoFill } from "react-icons/ri";
import { RiTeamFill } from "react-icons/ri";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ showSideBar, setShowSideBar }) => {

  const navigate = useNavigate();
  console.log(setShowSideBar);

  const [username,setUsername] = useState('');

  useEffect(()=>{
    
    const fetchUsername = async () => {

      const {data,error} = await supabase.auth.getSession();

      // console.log(data.session.user.id);
      

      if(data){
        const currentUserId = data.session.user.id

        const username = await supabase.from('profiles').select('full_name').eq('id',currentUserId);
        // console.log(username.data[0].full_name);
        
        setUsername(username.data[0].full_name);

      } else {
        console.log('User is not logged in');
        setUsername('User')
      }

    }

    fetchUsername();
  },[])

  const { page, setPage } = usePageContext();

  const handleNotes = () => {
    setPage("Notes");
  };

  const handleTodo = () => {
    setPage("Todo");
  };

  const handleLogout = async() => {
    const {error} = await supabase.auth.signOut();
    // window.location.reload();

    if(error){
      console.log(error.message)
    } else {
      navigate('/')
    }
  };

  return (
    <div className={`sidebar ${showSideBar ? "" : "closed"}`}>
      <div className="profile-section">
        <FaUserCircle onClick={()=>{handleLogout()}} />
        <div className="sidebar-username">{username}</div>
        <div className="notifications">
          <IoNotifications />
        </div>
      </div>
      <div className="sidebar-options">
        <ul>
          <li><MdDashboard style={{paddingRight:"0.4rem"}}/>Home</li>
          <li onClick={()=>{handleNotes()}}><MdViewKanban style={{paddingRight:"0.4rem"}}/>Kanban</li>
          <li onClick={()=>{handleTodo()}}><RiTodoFill style={{paddingRight:"0.4rem"}}/>Todo</li>
          <li><BiChalkboard style={{paddingRight:"0.4rem"}}/>Whiteboard</li>
          <li><RiTeamFill style={{paddingRight:"0.4rem"}}/>Organizations</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
