import React, { useEffect, useRef, useState } from "react";
import "./Sidebar.css";
import { FaChevronLeft, FaInbox, FaUserCircle } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { usePageContext } from "../Contexts/PageContext";
import { MdDashboard } from "react-icons/md";
import { MdViewKanban } from "react-icons/md";
import { BiChalkboard } from "react-icons/bi";
import { RiTodoFill } from "react-icons/ri";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useOrganization } from "../Contexts/OrganizationContext";
import { useProjectContext } from "../Contexts/ProjectContext";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useOrgIdStore } from "../Contexts/OrgIdStore";
import { useNotifications } from "../Contexts/NotificationContext";

const Sidebar = ({ values }) => {
  const navigate = useNavigate();
  // console.log(setShowSideBar);

  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  const { showSideBar, setShowSideBar } = values;

  const {notifications, setNotifications} = useNotifications();
  const [associatedOrganizations, setAssociatedOrganizations] = useState([]);

  const orgOptionsRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(true);

  const [organizations, setOrganizations] = useState([]);
  const [showOrganizations, setShowOrganizations] = useState(true);

  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const [organizationName, setOrganizationName] = useState("");
  const selectedOrgId = useOrgIdStore((state) => state.selectedOrgId);
  const setSelectedOrgId = useOrgIdStore((state) => state.setSelectedOrgId);

  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const [showAllOrgs, setShowAllOrgs] = useState(false);

  const [logout, setLogout] = useState(false);

  const [loading, setLoading] = useState(true);

  const { selectedOrganization, setSelectedOrganization } = useOrganization();
  const { selectedProject, setSelectedProject } = useProjectContext();

  useEffect(() => {
    const fetchUsername = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();

      if (data) {
        console.log("Got the user data", data);

        const currentUserId = data.session.user.id;
        localStorage.setItem("currentUserId", currentUserId);

        const username = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", currentUserId);

        setUsername(username.data[0].full_name);
        setUserAvatar(username.data[0].avatar_url);
        setLoading(false);
      } else {
        console.log("User is not logged in");
        setLoading(false);
        setUsername("User");
      }

      fetchOrganizations();
    };

    fetchUsername();
  }, [notifications]);

  useEffect(() => {
    if (selectedOrganization) {
      fetchProjects();
    }
  }, [selectedOrganization]);

  const handleClickOutside = (e) => {
    if (orgOptionsRef.current && !orgOptionsRef.current.contains(e.target)) {
      setShowAllOrgs(false);
    }
  };

  useEffect(() => {
    if (showAllOrgs) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAllOrgs]);

  const fetchProjects = async () => {
    setLoading(true);
    if (!selectedOrganization) {
      setLoading(false);
      console.error("No organization selected");
      return;
    }

    const fetchedOrgId = await supabase
      .from("organizations")
      .select("id")
      .eq("name", selectedOrganization)
      .single();

    console.log("data", fetchedOrgId);

    if (!fetchedOrgId.data) {
      setLoading(false);
      console.error("Organization not found");
      return;
    }

    const org_id = fetchedOrgId.data.id;
    setSelectedOrgId(org_id);
    // console.log(org_id);

    const response = await axios
      .get(`https://zenflow-kclv.onrender.com/projects/${org_id}`)
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
    }
    setProjects(fetchedProjectNames);
    setLoading(false);
  };

  const fetchOrganizations = async () => {
    const userId = localStorage.getItem("currentUserId");

    const response = await axios.get(
      "https://zenflow-kclv.onrender.com/organizations",
      {
        params: { id: userId },
      }
    );

    try {
      const { data, error } = await supabase
        .from("userorganizations")
        .select("*")
        .eq("user_id", userId);
      console.log("associated orgs", data);

      const associatedOrganizationsData = await Promise.all(
        data.map(async (org1) => {
          const { data: associatedOrgNames, error } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", org1.organization_id);

          if (associatedOrgNames) {
            console.log("associated org names", associatedOrgNames);

            const orgData = associatedOrgNames.map((org) => {
              return {
                sec_id: org.id,
                org_name: org.name,
                org_owner: org.owner_id,
                org_user_role: org1.role,
              };
            });
            return orgData;
          }

          if (error) {
            console.log(error);
            return;
          }
        })
      );

      console.log(associatedOrganizationsData);

      let flattenedOrgNames = associatedOrganizationsData
        .flat()
        .map((org) => org); // Extract just the name property

      console.log(flattenedOrgNames);

      setAssociatedOrganizations(flattenedOrgNames);
    } catch (error) {
      console.log(error);
    }

    const ownOrganizationsData = response.data;
    const fetchedOrganizations = ownOrganizationsData.map((organization) => {
      return organization.name;
    });

    if (!fetchedOrganizations) {
      console.log("Error fetching organizations");
      setLoading(false);
    } else {
      setSelectedOrganization(fetchedOrganizations[0]);
      setLoading(false);
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
      await axios.post(
        "https://zenflow-kclv.onrender.com/organizations/create",
        {
          name: name,
          owner_id: id,
        }
      );
      console.log(`${name} Organization created!!`);
    } catch (err) {
      console.log(err);
    } finally {
      fetchOrganizations();
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
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

  const handleInbox = () => {
    setPage("Inbox");
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
    setPage("OrganizationHome");
    setShowAllOrgs(false);
  };

  const handleClickOnProject = (project) => {
    setSelectedProject(project);
  };

  const createProject = async (e) => {
    console.log(selectedOrgId);
    e.preventDefault();
    console.log(projectName, projectDesc);
    const data = await axios.post(
      "https://zenflow-kclv.onrender.com/projects/create",
      {
        name: projectName,
        description: projectDesc,
        organization_id: selectedOrgId,
      }
    );
    console.log(data);
    fetchProjects();
    setShowAddProjectModal(false);
  };

  const handleShowAllOrgs = () => {
    setShowAllOrgs((prev) => !prev);
  };

  return (
    <div className={`sidebar ${showSideBar ? "" : "closed"}`}>
      <div className="profile-section">
        {!userAvatar && (
          <FaUserCircle
            onClick={() => {
              setLogout(true);
            }}
          />
        )}
        {logout && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 style={{ color: "black" }}>Are you sure?</h2>
                <button
                  onClick={() => {
                    setLogout(false);
                  }}
                  className="close-button"
                >
                  &times;
                </button>
              </div>
              <form>
                <div
                  className="form-group"
                  style={{ color: "black", textAlign: "center" }}
                >
                  Do you wish to logout?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => {
                      setLogout(false);
                    }}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                  <button className="submit-button" onClick={handleLogout}>
                    Yes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {userAvatar && (
          <img
            style={{ width: "30px", height: "30px", borderRadius: "15px" }}
            src={userAvatar}
            onClick={() => {
              setLogout(true);
            }}
          />
        )}
        <div className="sidebar-username">{selectedOrganization}</div>
        <div className="notifications">
          <FaChevronDown onClick={handleShowAllOrgs} />
        </div>
        {showAllOrgs && (
          <div className="organization-options" ref={orgOptionsRef}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#04151e",
                borderTopLeftRadius: "7px",
                borderTopRightRadius: "7px",
              }}
            >
              <h3 style={{ backgroundColor: "transparent" }}>Organizations</h3>
              <IoMdAdd
                className="add-organization-btn"
                style={{
                  width: "24px",
                  height: "24px",
                  paddingRight: "0.5rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  addOrganization();
                }}
              />
            </div>
            <hr style={{ opacity: "0.5" }} />
            {organizations.length === 0 && (
              <div className="organization-li">Create one</div>
            )}
            {organizations.map((org, index) => {
              return (
                <div
                  key={index}
                  className={
                    selectedOrganization === org
                      ? "selected-organization"
                      : "organization-li"
                  }
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleClickOnOrganization(org);
                  }}
                >
                  {org}
                </div>
              );
            })}
            <hr style={{ opacity: "0.5" }} />
            <h3
              style={{
                backgroundColor: "#04151e",
                fontSize: "0.9rem",
                display: "flex",
              }}
            >
              Associated Organizations
            </h3>
            {!associatedOrganizations.length && (
              <div className="organization-li">No associated organizations</div>
            )}
            {associatedOrganizations.map((org, index) => {
              return (
                <div
                  key={index}
                  className={
                    selectedOrganization === org
                      ? "selected-organization"
                      : "organization-li"
                  }
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  // onClick={() => {
                  //   handleClickOnOrganization(org);
                  // }}
                >
                  {org.org_name}
                  <p style={{ opacity: "0.5", fontSize: "small" }}>
                    {org.org_user_role}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="sidebar-options">
        <ul>
          <div className="overview-options">
            <li>
              <MdDashboard style={{ paddingRight: "0.4rem" }} />
              Home
            </li>
            <li
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => {
                handleInbox();
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaInbox style={{ paddingRight: "0.4rem" }} />
                Inbox
              </div>

              {notifications.length > 0 && (
                <p
                  style={{
                    backdropFilter: "brightness(2.25)",
                    width: "20px",
                    height: "20px",
                    textAlign: "center",
                    borderRadius: "15px",
                    fontSize: "small",
                    marginRight: "0.5rem",
                  }}
                >
                  {notifications.length}
                </p>
              )}
            </li>
            <li
              className={page === "Notes" ? "selected-overview" : ""}
              onClick={() => {
                handleNotes();
              }}
            >
              <MdViewKanban style={{ paddingRight: "0.4rem" }} />
              Kanban
            </li>
            <li>
              <BiChalkboard style={{ paddingRight: "0.4rem" }} />
              Whiteboard
            </li>
          </div>
          {/* <li className="organizations-section">
            <div
              onClick={() => {
                toggleOrganizations();
              }}
            >
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
          </li> */}
          {/* {loading && (
            <div style={{ width: "90%", margin: "auto" }}>
              <SkeletonTheme baseColor="#ffffff21" highlightColor="#ffffff25">
                <p>
                  <Skeleton count={1} duration={1} />
                  <Skeleton count={1} duration={0.6} />
                </p>
              </SkeletonTheme>
            </div>
          )}
          {!loading && !organizations.length && (
            <li style={{ justifyContent: "center", fontSize: "0.9rem" }}>
              Create an Organization
            </li>
          )}
          {!loading && showOrganizations && (
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
          )} */}

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

          {loading && (
            <div style={{ width: "90%", margin: "auto" }}>
              <SkeletonTheme baseColor="#ffffff21" highlightColor="#ffffff25">
                <p>
                  <Skeleton count={1} duration={1} />
                  <Skeleton count={1} duration={1.25} />
                  <Skeleton count={1} duration={0.6} />
                </p>
              </SkeletonTheme>
            </div>
          )}
          {!loading && organizations.length && !projects.length && (
            <li style={{ justifyContent: "center", fontSize: "0.9rem" }}>
              Create a Project
            </li>
          )}

          {!loading && showProjects && (
            <ul
              style={{
                paddingLeft: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
                paddingTop: "0.5rem",
                paddingRight: "0.5rem",
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
                    {project ? project : ""}
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
