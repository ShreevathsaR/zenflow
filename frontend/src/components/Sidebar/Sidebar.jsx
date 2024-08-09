import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { FaUserCircle } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { usePageContext } from "../Contexts/PageContext";
import { MdDashboard } from "react-icons/md";
import { MdViewKanban } from "react-icons/md";
import { BiChalkboard } from "react-icons/bi";
import { RiTodoFill } from "react-icons/ri";
import { GoProjectRoadmap } from "react-icons/go";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ showSideBar, setShowSideBar }) => {

  const navigate = useNavigate();
  // console.log(setShowSideBar);

  const [username, setUsername] = useState('');

  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);

  const [organizations, setOrganizations] = useState([]);
  const [showOrganizations, setShowOrganizations] = useState(false);

  const [showAddOrgModal, setShowAddOrgModal] = useState(false);

  const [organizationName, setOrganizationName] = useState('');

  useEffect(() => {

    setProjects(["Project 1", "Project 2"]);
    setOrganizations(["Organization 1", "Organization 2"]);


    const fetchUsername = async () => {

      const { data, error } = await supabase.auth.getSession();

      // console.log(data.session.user.id);


      if (data) {
        const currentUserId = data.session.user.id

        const username = await supabase.from('profiles').select('full_name').eq('id', currentUserId);
        // console.log(username.data[0].full_name);

        setUsername(username.data[0].full_name);

      } else {
        console.log('User is not logged in');
        setUsername('User')
      }

    }

    fetchUsername();
  }, [])

  const { page, setPage } = usePageContext();

  const handleNotes = () => {
    setPage("Notes");
  };

  const handleTodo = () => {
    setPage("Todo");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    // window.location.reload();

    if (error) {
      console.log(error.message)
    } else {
      navigate('/')
    }
  };

  const toggleProjects = () => {
    setShowProjects(prev => !prev);
  };

  const toggleOrganizations = () => {
    setShowOrganizations(prev => !prev);
  };

  const addOrganization = () => {
    setShowAddOrgModal(prev => !prev);
  }

  const createOrganization = () => {
    console.log(organizationName);
  }

  return (
    <div className={`sidebar ${showSideBar ? "" : "closed"}`}>
      <div className="profile-section">
        <FaUserCircle onClick={() => { handleLogout() }} />
        <div className="sidebar-username">{username}</div>
        <div className="notifications">
          <IoNotifications />
        </div>
      </div>
      <div className="sidebar-options">
        <ul>
          <li><MdDashboard style={{ paddingRight: "0.4rem" }} />Home</li>
          <li onClick={() => { handleNotes() }}><MdViewKanban style={{ paddingRight: "0.4rem" }} />Kanban</li>
          <li onClick={() => { handleTodo() }}><RiTodoFill style={{ paddingRight: "0.4rem" }} />Todo</li>
          <li><BiChalkboard style={{ paddingRight: "0.4rem" }} />Whiteboard</li>
          <li className="organizations-section" onClick={() => { toggleOrganizations() }}>
            <div>
              <RiTeamFill style={{ paddingRight: "0.4rem" }} />
              Organizations
            </div>
            <div className="add-organization" style={{ display: "flex", alignItems: "center" }}>
              <IoMdAdd className="add-organization-btn" style={{ width: "24px", height: "24px", paddingRight: "0.5rem" }} onClick={() => { addOrganization() }} />
              {!showOrganizations && (
                <FaChevronDown style={{ justifySelf: "center" }} />
              )}
              {showOrganizations && (
                <FaChevronUp />
              )}
            </div>
          </li>
          {showOrganizations && (
            <ul className="organization-list">
              {organizations.map((org, index) => {
                return (
                  <li className="organization" key={index}>
                    {org}
                  </li>
                );
              })}
            </ul>
          )}

          {showAddOrgModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Add an Organization</h2>
                  <button onClick={() => { setShowAddOrgModal(false) }} className="close-button">&times;</button>
                </div>
                <form onSubmit={()=>{createOrganization()}}>
                  <div className="form-group">
                    <label htmlFor="title">Organization Name</label>
                    <input
                      type="text"
                      id="title"
                      className="input-field"
                      placeholder="Enter title"
                      onChange={e => setOrganizationName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick={() => { setShowAddOrgModal(false) }} className="cancel-button">Cancel</button>
                    <button type="submit" className="submit-button">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <br style={{ backgroundColor: "gray" }} />


          <li className="projects-section"
            onClick={() => { toggleProjects() }} style={{ justifyContent: "space-between", backgroundColor: "#0C2D48" }}>
            <div>
              <GoProjectRoadmap style={{ paddingRight: "0.4rem" }} />
              Projects
            </div>
            <div className="add-project" style={{ display: "flex", alignItems: "center" }}>
              <IoMdAdd className="add-project-btn" style={{ width: "24px", height: "24px", paddingRight: "0.5rem" }} />
              {!showProjects && (
                <FaChevronDown style={{ justifySelf: "center" }} />
              )}
              {showProjects && (
                <FaChevronUp />
              )}
            </div>
          </li>
          {showProjects && (
            <ul style={{ paddingLeft: "1rem" }}>
              {projects.map((project, index) => {
                return <li key={index}>{project}</li>
              })}
            </ul>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
