import React, { useEffect, useState } from "react";
import { useProjectContext } from "../Contexts/ProjectContext";
import { useOrganization } from "../Contexts/OrganizationContext";
import { MdContentCopy } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { supabase } from "../../supabaseClient";
import axios from "axios";
import "./OrganizationHome.css";

const OrganizationHome = () => {
  const [projects, setProjects] = useState([]);
  const [orgUsers, setOrgUsers] = useState([]);

  const [collaboratorEmail, setCollaboratorEmail] = useState("");

  const [addUsersModal, setAddUsersModal] = useState(false);

  const { selectedOrganization, setSelectedOrganization } = useOrganization();
  const { selectedProject, setSelectedProject } = useProjectContext();

  useEffect(() => {

   const getSession = async () => {
      try {
      const { data, error } = await supabase.auth.getSession();
        console.log(data)

    } catch (error) {
      console.log(error.message);
    }}

    const fetchProjects = async () => {
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
        console.log(selectedProject);
      }

      // console.log(fetchedOrganizations)
      setProjects(fetchedProjectNames);
    };

    const fetchedOrganizationUsers = async () => {
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
          `http://localhost:8000/organization/users/${org_id}`
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
              console.log(error);
              return null;
            }

            return data.full_name;
          })
        );

        setOrgUsers(fetchedOrgUsersName);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProjects();
    getSession();

    if (projects) {
      fetchedOrganizationUsers();
    }
  }, [selectedOrganization,collaboratorEmail]);

  const handleAddUsers = (e) => {
    e.preventDefault();
    setAddUsersModal(true);
  };

  const AddUser = async (e) => {
    e.preventDefault();
    console.log("Add users", collaboratorEmail);

    try {

      const { data, error } = await supabase.from('profiles').select('id').eq('email', collaboratorEmail).single();
      const collabUserId =  data.id;

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

      if (!collabUserId){
        console.log('User not found')
        return;
      } else {
        const {data,error} = await supabase.from('userorganizations').insert({
        organization_id: org_id,
        user_id: collabUserId
      })
      console.log(error);
    }
    } catch (err) {
      console.log(err);
    }

    setAddUsersModal(false);
  };

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

            {orgUsers &&
              orgUsers.map((user, index) => {
                return <li key={index}>{user}</li>;
              })}
          </ul>
          <div className="invite-link">
            Invite Link
            <MdContentCopy />
          </div>
        </div>

        <div className="org-overview">
          <div className="org-tools">
            <ul>
              <li className="kanban-option">Kanban</li>
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
