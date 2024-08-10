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
import axios from "axios";

const Sidebar = ({ showSideBar, setShowSideBar }) => {
  const navigate = useNavigate();
  // console.log(setShowSideBar);

  const [username, setUsername] = useState("");

  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(true);

  const [organizations, setOrganizations] = useState([]);
  const [showOrganizations, setShowOrganizations] = useState(true);

  const [showAddOrgModal, setShowAddOrgModal] = useState(false);

  const [organizationName, setOrganizationName] = useState("");

  useEffect(() => {


    const fetchUsername = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data) {
        const currentUserId = data.session.user.id;
        localStorage.setItem("currentUserId", currentUserId);

        const username = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", currentUserId);

        setUsername(username.data[0].full_name);
      } else {
        console.log("User is not logged in");
        setUsername("User");
      }
    };

    fetchUsername();
    fetchOrganizations();
    fetchProjects();
  }, []);


  const fetchOrganizations = async () => {

    const id = localStorage.getItem("currentUserId");

    const response = await axios.get('http://localhost:8000/organizations', {
      params: { id: id }
    })
    console.log(response.data)
    const organizationsData = response.data;
    const fetchedOrganizations = organizationsData.map((organization) => {
      return organization.name
    })

    setOrganizations(fetchedOrganizations);
  };

  const fetchProjects = async () => {
    const org_id = 8;
    const response = await axios.get(`http://localhost:8000/projects/${org_id}`)
    .catch((error) => {
      console.log(error);
    })

    const fetchedOrganizationsData = response.data.rows;
    const fetchedOrganizations = fetchedOrganizationsData.map((organization) => {
      return organization.name
    })
    // console.log(fetchedOrganizations)
    setProjects(fetchedOrganizations);
  }


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
    localStorage.removeItem("currentUserId");

    if (error) {
      console.log(error.message);
    } else {
      navigate("/");
    }
  };

  const toggleProjects = () => {
    setShowProjects((prev) => !prev);
  };

  const toggleOrganizations = () => {
    setShowOrganizations((prev) => !prev);
  };

  const addOrganization = () => {
    setShowAddOrgModal((prev) => !prev);
  };

  const createOrganization = async (e) => {
    e.preventDefault();

    const id = localStorage.getItem("currentUserId");
    const name = organizationName;
    console.log(name, id);
    setShowAddOrgModal(false);
    try {
      await axios.post('http://localhost:8000/organizations/create', { name: name, owner_id: id })
      console.log(`${name} Organization created!!`);
    }
    catch (err) {
      console.log(err)
    }
    finally {
      fetchOrganizations();
    }
  };

  return (
    <div className={`sidebar ${showSideBar ? "" : "closed"}`}>
      <div className="profile-section">
        <FaUserCircle
          onClick={() => {
            handleLogout();
          }}
        />
        <div className="sidebar-username">{username}</div>
        <div className="notifications">
          <IoNotifications />
        </div>
      </div>
      <div className="sidebar-options">
        <ul>
          <li>
            <MdDashboard style={{ paddingRight: "0.4rem" }} />
            Home
          </li>
          <li
            onClick={() => {
              handleNotes();
            }}
          >
            <MdViewKanban style={{ paddingRight: "0.4rem" }} />
            Kanban
          </li>
          <li
            onClick={() => {
              handleTodo();
            }}
          >
            <RiTodoFill style={{ paddingRight: "0.4rem" }} />
            Todo
          </li>
          <li>
            <BiChalkboard style={{ paddingRight: "0.4rem" }} />
            Whiteboard
          </li>
          <li
            className="organizations-section"
          >
            <div onClick={() => {
              toggleOrganizations();
            }}>
              <RiTeamFill style={{ paddingRight: "0.4rem" }} />
              Organizations
            </div>
            <div
              className="add-organization"
              style={{ display: "flex", alignItems: "center" }}
            >
              <IoMdAdd
                className="add-organization-btn"
                style={{
                  width: "24px",
                  height: "24px",
                  paddingRight: "0.5rem",
                }}
                onClick={() => {
                  addOrganization();
                }}
              />
              {!showOrganizations && (
                <FaChevronDown onClick={() => {
                  toggleOrganizations();
                }} style={{ justifySelf: "center" }} />
              )}
              {showOrganizations && <FaChevronUp onClick={() => {
                toggleOrganizations();
              }} />}
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
                  <button
                    onClick={() => {
                      setShowAddOrgModal(false);
                    }}
                    className="close-button"
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={createOrganization}>
                  <div className="form-group">
                    <label htmlFor="title">Organization Name</label>
                    <input
                      type="text"
                      id="title"
                      className="input-field"
                      placeholder="Enter title"
                      onChange={(e) => setOrganizationName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddOrgModal(false);
                      }}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="submit-button">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <br style={{ backgroundColor: "gray" }} />

          <li
            className="projects-section"
            style={{
              justifyContent: "space-between",
              backgroundColor: "#0C2D48",
            }}
          >
            <div onClick={() => {
              toggleProjects();
            }}>
              <GoProjectRoadmap style={{ paddingRight: "0.4rem" }} />
              Projects
            </div>
            <div
              className="add-project"
              style={{ display: "flex", alignItems: "center" }}
            >
              <IoMdAdd
                className="add-project-btn"
                style={{
                  width: "24px",
                  height: "24px",
                  paddingRight: "0.5rem",
                }}
              />
              {!showProjects && (
                <FaChevronDown style={{ justifySelf: "center" }} onClick={() => {
                  toggleProjects();
                }} />
              )}
              {showProjects && <FaChevronUp onClick={() => {
                toggleProjects();
              }} />}
            </div>
          </li>
          {showProjects && (
            <ul style={{ paddingLeft: "1rem" }}>
              {projects.map((project, index) => {
                return <li key={index}>{project}</li>;
              })}
            </ul>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
