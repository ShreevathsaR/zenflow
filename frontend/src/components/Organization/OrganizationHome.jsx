import React, { useEffect, useState } from "react";
import { useProjectContext } from "../Contexts/ProjectContext";
import { useOrganization } from "../Contexts/OrganizationContext";
import { MdCardMembership, MdContentCopy } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { supabase } from "../../supabaseClient";
import axios from "axios";
import { InfinitySpin } from "react-loader-spinner";
import "./OrganizationHome.css";
import { usePageContext } from "../Contexts/PageContext";
import { useOrgIdStore } from "../Contexts/OrgIdStore";
import Swal from "sweetalert2";

const OrganizationHome = () => {
  const [projects, setProjects] = useState([]);
  const [orgUsers, setOrgUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);

  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");

  const [addUsersModal, setAddUsersModal] = useState(false);

  const { selectedOrganization, setSelectedOrganization } = useOrganization();
  const { selectedOrgId, setSelectedOrgId } = useOrgIdStore();

  const { selectedProject, setSelectedProject } = useProjectContext();

  const { page, setPage } = usePageContext();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchProjects = async () => {
      setLoading(true);
      const fetchedOrgId = await supabase
        .from("organizations")
        .select("id")
        .eq("name", selectedOrganization)
        .single();

      if (!fetchedOrgId.data) {
        console.error("Organization not found");
        setLoading(false);
        return;
      }

      const org_id = fetchedOrgId.data.id;

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
        console.log(selectedProject);
      }

      // console.log(fetchedOrganizations)
      setProjects(fetchedProjectNames);
      setLoading(false);
    };

    fetchProjects();
    getSession();

    if (projects) {
      fetchedOrganizationUsers();
    }
  }, [selectedOrganization, collaboratorEmail]);

  const fetchedOrganizationUsers = async () => {
    console.log(selectedOrgId);
    
    setLoading(true);
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

    try {
      const response = await axios.get(
        `https://zenflow-kclv.onrender.com/organization/users/${selectedOrgId}`
        // `http://localhost:8000/organization/users/${org_id}`
      );
      console.log("Fetched users:", response.data);

      const fetchedUsers = response.data;
      const fetchedOrgUsersId = fetchedUsers.map((user) => {
        return user.user_id;
      });

      const fetchedOrgUsersName = await Promise.all(
        fetchedOrgUsersId.map(async (userid) => {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userid)
            .single();

          if (error) {
            setLoading(false);
            console.log(error);
            return null;
          }
          setLoading(false);
          return data.full_name;
        })
      );

      setOrgUsers(fetchedOrgUsersName);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUsers = (e) => {
    e.preventDefault();
    setAddUsersModal(true);
  };

  const AddUser = async (e) => {
    setLoading(true);
    setAddUsersModal(false);
    e.preventDefault();
    console.log("Add users", collaboratorEmail);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", collaboratorEmail)
        .single();
      console.log("Add user data", data);
      const collabUserId = data.id;

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

      if (!collabUserId) {
        console.log("User not found");
        return;
      } else {
        const { data, error } = await supabase
          .from("userorganizations")
          .insert({
            organization_id: org_id,
            user_id: collabUserId,
          });
        console.log(error);
        setAddUsersModal(false);
        fetchedOrganizationUsers();
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setAddUsersModal(false);
    }

    setAddUsersModal(false);
  };

  const handleUserInvite = async (e) => {
    e.preventDefault();
    setShowInviteModal(false);
    setLoading(true)
    console.log('Collaborator Email', newCollaboratorEmail);

    try {
      const { data: userValidationData, error: userValidationError } = await supabase.from("profiles").select("*").eq("email", newCollaboratorEmail);
      
      if (userValidationError) {
        console.log(userValidationError);
        console.log('Data',userValidationData);
        return;
      }

      if(userValidationData[0].email === newCollaboratorEmail){
        Swal.fire({
          icon: "error",
          title: "User is already registered!",
          text: `User with email ${newCollaboratorEmail} is already registered, add him as a collaborator.`,
        });
        setLoading(false);
        return
      }

    } catch (error) {
      console.log(error);
    }


    

    console.log(selectedOrgId);

    const { data: userData, error: userError } = await supabase.auth.getSession();
    
    console.log(userData.session);

    const userId = userData.session.user.id;

    const { data: userName, error: userNameError } = await supabase.from('profiles').select('full_name').eq('id', userId).single();
    
    console.log(userName.full_name);
    

    if (userError) {
      console.log(userError);
      return;
    } else {
      const inviterName = userName.full_name;

      const response = await axios.post(
        "https://zenflow-kclv.onrender.com/invite",
        {
          inviterName: inviterName,
          organizationId: selectedOrgId,
          email: newCollaboratorEmail,
          organizationName: selectedOrganization,
        }
      );
      console.log(response);
      
      if (response.data.message.success === true) {
        Swal.fire({
          title: "Invite Sent!",
          text: `Your invite to ${newCollaboratorEmail} was successful`,
          icon: "success",
        });
        setLoading(false)
        setNewCollaboratorEmail("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Invite was not sent",
          text: "Something went wrong!",
        });
        setLoading(false)
        setNewCollaboratorEmail("");
      }
    }
  };

  // const inviteUser

  return (
    <div className="orghome-container">
      <div className="org-header">
        <h3>{selectedOrganization}</h3>
      </div>
      <div className="org-main">
        <div className="org-collaborators">
          <ul>
            <h3
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Collaborators
              <IoMdAdd onClick={handleAddUsers} />
            </h3>
            {loading && (
              <div className="modal-overlay">
                <div className="spinner-container">
                  <InfinitySpin
                    visible={true}
                    width="200"
                    ariaLabel="infinity-spin-loading"
                    color="rgba(73, 76, 212, 1)"
                  />
                </div>
              </div>
            )}

            {addUsersModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2 style={{ color: "black" }}>Add Collaborators</h2>
                    <button
                      onClick={() => {
                        setAddUsersModal(false);
                      }}
                      className="close-button"
                    >
                      &times;
                    </button>
                  </div>
                  <form onSubmit={AddUser}>
                    <div className="form-group">
                      <label htmlFor="title" style={{ color: "black" }}>
                        Enter User Email
                      </label>
                      <input
                        type="text"
                        id="title"
                        className="input-field"
                        placeholder="Enter email"
                        onChange={(e) => setCollaboratorEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        onClick={() => {
                          setAddUsersModal(false);
                        }}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="submit-button">
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {orgUsers.length === 0 && (
              <p
                style={{
                  opacity: "0.25",
                  textAlign: "center",
                  cursor: "default",
                  paddingTop: "2rem",
                }}
              >
                No collaborators
              </p>
            )}
            {orgUsers &&
              orgUsers.map((user, index) => {
                return <li key={index}>{user}</li>;
              })}
          </ul>
          <div
            className="invite-link"
            onClick={()=>{setShowInviteModal(true)}}
            style={{ cursor: "pointer" }}
          >
            Invite members
            <MdCardMembership />
          </div>
          {showInviteModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <div style={{display:"flex", flexDirection:"column"}}>
                  <h2 style={{ color: "black" }}>Invite Collaborators</h2>
                  <p style={{ color: "black" }}>An invite link will be sent to this mail ID</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                    }}
                    className="close-button"
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={handleUserInvite}>
                  <div className="form-group">
                    <label htmlFor="title" style={{ color: "black" }}>
                      Enter User Email
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="input-field"
                      placeholder="Enter email"
                      onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={() => {
                        setShowInviteModal(false);
                      }}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="submit-button">
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="org-overview">
          <div className="org-tools">
            <ul>
              <li
                className="kanban-option"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setPage("Notes");
                }}
              >
                Kanban
              </li>
              <li className="todo-option">Todo</li>
              <li className="whiteboard-option">Whiteboard</li>
            </ul>
          </div>
          <div className="org-projects-section">
            <h2>Projects</h2>
            <hr />
            <ul>
              {projects.map((project, index) => (
                <li key={index}>{project}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="priority-section">
          <h3>Priority Section</h3>
          <ul>
            <li>Task 0</li>
            <li>Task 1</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrganizationHome;
