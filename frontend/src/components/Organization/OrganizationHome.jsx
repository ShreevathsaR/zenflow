import React, { useEffect, useState } from 'react'
import { useProjectContext } from '../Contexts/ProjectContext'
import { useOrganization } from '../Contexts/OrganizationContext';
import { MdContentCopy } from "react-icons/md";
import { supabase } from '../../supabaseClient';
import axios from 'axios';
import './OrganizationHome.css'

const OrganizationHome = () => {

    const [projects,setProjects] = useState([]);
    const [orgUsers,setOrgUsers] = useState([]);

    const { selectedOrganization, setSelectedOrganization } = useOrganization();
    const { selectedProject, setSelectedProject } = useProjectContext();

    useEffect(()=>{
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
               const response = await axios.get(`http://localhost:8000/organization/users/${org_id}`)
               console.log('Fetched users:',response.data)

               const fetchedUsers = response.data;
                const fetchedOrgUsersId = fetchedUsers.map((user,index) => {
                    return user.user_id
                })

                setOrgUsers(fetchedOrgUsersId);

            } catch (error) {
                console.log(error)
            }

          }

          fetchProjects();

          if(projects){
            fetchedOrganizationUsers();
          }
    },[selectedOrganization])

    return (
        <div className='orghome-container'>
            <div className='org-header'>
                <h3>{selectedOrganization}</h3>
            </div>
            <div className='org-main'>
                <div className='org-collaborators'>
                    <ul>
                        <h3>Collaborators</h3>
                        {orgUsers && orgUsers.map((user,index) => {
                            return <li key={index}>{user}</li>
                        })}
                    </ul>
                    <div className='invite-link'>Invite Link<MdContentCopy /></div>
                </div>

                <div className='org-overview'>
                    <div className='org-tools'>
                        <ul>
                            <li className='kanban-option'>Kanban</li>
                            <li className='todo-option'>Todo</li>
                            <li className='whiteboard-option'>Whiteboard</li>
                        </ul>
                    </div>
                    <div className='org-projects-section'>
                        <h2>Projects</h2>
                        <hr />
                        <ul>
                            {projects.map((project,index) => (
                                <li key={index}>
                                    {project}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='priority-section'>
                    <h3>Priority Section</h3>
                    <ul>
                        <li>Task 0</li>
                        <li>Task 1</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default OrganizationHome
