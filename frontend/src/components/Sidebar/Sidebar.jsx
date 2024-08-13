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
import { useOrganization } from "../Contexts/OrganizationContext";

import { useProjectContext } from "../Contexts/ProjectContext";

const Sidebar = ({ showSideBar, setShowSideBar }) => {
  const navigate = useNavigate();
  // console.log(setShowSideBar);

  const [username, setUsername] = useState("");

  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(true);

  const [organizations, setOrganizations] = useState([]);
  const [showOrganizations, setShowOrganizations] = useState(true);

  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const [organizationName, setOrganizationName] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState(null);

  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const { selectedOrganization, setSelectedOrganization } = useOrganization();
  const { selectedProject, setSelectedProject } = useProjectContext();

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

      fetchOrganizations();
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    if (selectedOrganization) {
      fetchProjects();
    }
  }, [selectedOrganization]);

  const fetchProjects = async () => {
    if (!selectedOrganization) {
      console.error("No organization selected");
      return;
    }

    const fetchedOrgId = await supabase
      .from("organizations")
      .select("id")
      .eq("name", selectedOrganization)
      .single();

    if (!fetchedOrgId.data) {
      console.error("Organization not found");
      return;
    }

    const org_id = fetchedOrgId.data.id;
    setSelectedOrgId(org_id);
    console.log(org_id);

    const response = await axios
      .get(`http://localhost:8000/projects/${org_id}`)
      .catch((error) => {
        console.log(error);
      });

    const fetchedProjectsData = response.data.rows;

    const fetchedProjectNames = fetchedProjectsData.map((organization) => {
      return organization.name;
    });

    if (!fetchedProjectNames) {
      console.log("Error fetching projects");
    } else {
      setSelectedProject(fetchedProjectNames[0]);
      console.log(selectedProject);
    }

    // console.log(fetchedOrganizations)
    setProjects(fetchedProjectNames);
  };

  const fetchOrganizations = async () => {
    const id = localStorage.getItem("currentUserId");

    const response = await axios.get("http://localhost:8000/organizations", {
      params: { id: id },
    });
    const organizationsData = response.data;
    const fetchedOrganizations = organizationsData.map((organization) => {
      return organization.name;
    });

    if (!fetchedOrganizations) {
      console.log("Error fetching organizations");
    } else {
      setSelectedOrganization(fetchedOrganizations[0]);
    }

    setOrganizations(fetchedOrganizations);
  };

  const createOrganization = async (e) => {
    e.preventDefault();

    const id = localStorage.getItem("currentUserId");
    const name = organizationName;
    console.log(name, id);
    setShowAddOrgModal(false);
    try {
      await axios.post("http://localhost:8000/organizations/create", {
        name: name,
        owner_id: id,
      });
      console.log(`${name} Organization created!!`);
    } catch (err) {
      console.log(err);
    } finally {
      fetchOrganizations();
    }
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

  const { page, setPage } = usePageContext();

  const handleNotes = () => {
    setPage("Notes");
  };

  const handleTodo = () => {
    setPage("Todo");
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

  const handleClickOnOrganization = (org) => {
    setSelectedOrganization(org);
    setPage("OrganizationHome")
  };

  const handleClickOnProject = (project) => {
    setSelectedProject(project);
  };

  const createProject = async (e) => {
    console.log(selectedOrgId);
    e.preventDefault();
    console.log(projectName, projectDesc);
    const data = await axios.post("http://localhost:8000/projects/create", {
      name: projectName,
      description: projectDesc,
      organization_id: selectedOrgId,
    });
    console.log(data);
    fetchProjects();
    setShowAddProjectModal(false);
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
          <div className="overview-options">
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
          </div>
          <li className="organizations-section">
            <div
              onClick={() => {
                toggleOrganizations();
              }}
            >
              {/* <RiTeamFill style={{ paddingRight: "0.4rem" }} /> */}
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
                <FaChevronDown
                  onClick={() => {
                    toggleOrganizations();
                  }}
                  style={{ justifySelf: "center" }}
                />
              )}
              {showOrganizations && (
                <FaChevronUp
                  onClick={() => {
                    toggleOrganizations();
                  }}
                />
              )}
            </div>
          </li>
          {showOrganizations && (
            <ul className="organization-list">
              {organizations.map((org, index) => {
                return (
                  <li
                    className={
                      selectedOrganization === org
                        ? "selected-organization"
                        : "organization"
                    }
                    key={index}
                    onClick={() => {
                      handleClickOnOrganization(org);
                    }}
                  >
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
            }}
          >
            <div
              onClick={() => {
                toggleProjects();
              }}
            >
              {/* <GoProjectRoadmap style={{ paddingRight: "0.4rem" }} /> */}
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
                onClick={() => {
                  setShowAddProjectModal(true);
                }}
              />
              {!showProjects && (
                <FaChevronDown
                  style={{ justifySelf: "center" }}
                  onClick={() => {
                    toggleProjects();
                  }}
                />
              )}
              {showProjects && (
                <FaChevronUp
                  onClick={() => {
                    toggleProjects();
                  }}
                />
              )}
            </div>
          </li>
          {showProjects && (
            <ul
              style={{
                paddingLeft: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
                paddingTop: "0.5rem",
                paddingRight:"0.5rem"
              }}
            >
              {projects.map((project, index) => {
                return (
                  <li
                    key={index}
                    className={
                      selectedProject === project
                        ? "selected-project"
                        : "fetched-project"
                    }
                    onClick={() => {
                      handleClickOnProject(project);
                    }}
                  >
                    {project}
                  </li>
                );
              })}
            </ul>
          )}
          {showAddProjectModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Add a Project</h2>
                  <button
                    onClick={() => {
                      setShowAddProjectModal(false);
                    }}
                    className="close-button"
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={createProject}>
                  <div className="form-group">
                    <label htmlFor="title">Project Name</label>
                    <input
                      type="text"
                      id="title"
                      className="input-field"
                      placeholder="Enter title"
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                    />
                    <label htmlFor="title">Project Description</label>
                    <input
                      type="text"
                      id="desc"
                      className="input-field"
                      placeholder="Enter Description"
                      onChange={(e) => setProjectDesc(e.target.value)}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddProjectModal(false);
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
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
