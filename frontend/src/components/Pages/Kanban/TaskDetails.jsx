import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import "./TaskDetails.css";
import { MdAssignmentInd } from "react-icons/md";
import { TiAttachmentOutline } from "react-icons/ti";
import { TbChecklist } from "react-icons/tb";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Select, { components } from "react-select";
import { useOrganization } from "../../Contexts/OrganizationContext";
import { useOrgIdStore } from "../../Contexts/OrgIdStore";
// import { ColourOption, colourOptions } from '../data';

const TaskDetails = ({ value }) => {
  const { selectedTask, setSelectedTask } = value;

  const [taskSectionName, setTaskSectionName] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedTo, setAssignedTo] = useState(null);

  const selectedOrgId = useOrgIdStore((state) => state.selectedOrgId);

  const [selectedCollaborator, setSelectedCollaborator] = useState(null);

  const [taskCollaborators, setTaskCollaborators] = useState([]);

  const colourOptions = [
    { value: "red", label: "Red", color: "#FF5630" },
    { value: "blue", label: "Blue", color: "#0052CC" },
    { value: "green", label: "Green", color: "#36B37E" },
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#f0f0f0", // Change background color of the control
      border: "1px solid #ccc", // Change border color of the control
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#01121a", // Change background color of the dropdown list
      color: "#fff", // Change text color of the dropdown options
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#141f29"
        : state.isFocused
        ? "#141f29"
        : "#01121a", // Change background on select/focus
      color: state.isSelected ? "white" : "lightgray", // Change text color based on selected or focused state
      padding: 10,
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
      fontWeight: "500",
      backgroundColor: "#141f29",
      borderRadius: "7px",
      padding: "0.25rem",
      paddingLeft: "1rem", // Change text color of selected value in the control
    }),
  };

  const SingleValue = ({ children, ...props }) => (
    <components.SingleValue {...props}>{children}</components.SingleValue>
  );

  useEffect(() => {
    selectedOrgId && getCollaborators(selectedOrgId);
    selectedTask && getTaskDetails() , getAssigneeData();

  }, []);

  const getTaskDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", selectedTask.id);
      // console.log(data);

      const currentTaskSectionId = data[0].section_id;

      if (currentTaskSectionId) {
        const { data, error } = await supabase
          .from("sections")
          .select("*")
          .eq("id", currentTaskSectionId);

        if (data) {
          setTaskSectionName(data[0].name);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowAssignModal = (e) => {
    e.preventDefault();
    setShowAssignModal(true);
  };

  const getCollaborators = async (selectedOrgId) => {
    try {
      // Fetch user IDs related to the organization
      const { data: userOrgdata, error: userOrgError } = await supabase
        .from("userorganizations")
        .select("user_id")
        .eq("organization_id", selectedOrgId);
  
      if (userOrgError) {
        console.log("Error fetching organization: ", userOrgError);
        return;
      }
  
      // Fetch collaborators (profiles) for all user IDs in parallel
      const userIds = userOrgdata.map((collaborator) => collaborator.user_id);
      
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, id")
        .in("id", userIds); // Fetch all profiles for the user IDs
  
      if (profileError) {
        console.log("Error fetching collaborators: ", profileError);
        return;
      }
  
      // Map over the profiles and create the desired structure
      const collaborators = profileData.map((collaborator) => ({
        value: collaborator.full_name.toLowerCase(),
        label: collaborator.full_name,
        userId: collaborator.id,
      }));
  
      console.log("Collaborators", collaborators);
      setTaskCollaborators(collaborators); // Update the state with the collaborators
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleChange = (selectedOption) => {
    setSelectedCollaborator(selectedOption);
    console.log("Selected Collaborator:", selectedOption);
  };

  const handleTaskAssignment = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("tasks")
      .update({
        assigned_to: selectedCollaborator.userId,
      })
      .eq("id", selectedTask.id);

    if (error) {
      console.log("Error updating", error);
    } else {
      console.log("update successfull", data);
      setAssignedTo(selectedCollaborator.label);
      setShowAssignModal(false);
      getAssigneeData();
    }
  };

  const getAssigneeData = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("assigned_to")
        .eq("id", selectedTask.id);

      if (data) {
        const assignedUserId = data[0].assigned_to
        const { data: assigneeName, error } = await supabase.from("profiles").select("full_name, id").eq("id", assignedUserId);
        console.log(assigneeName[0].full_name);
        setAssignedTo(assigneeName[0].full_name);
      }

    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="task-details-wrapper">
      <div className="task-details-left">
        <h3>{selectedTask.name}</h3>
        <p>
          in <u>{taskSectionName}</u>
        </p>
        <p style={{ color: "grey", fontSize: "0.75rem", opacity: "0.9" }}>
          created at 7th Sept
        </p>
        <p style={{ color: "grey", fontSize: "0.75rem", opacity: "0.9" }}>
          added by Shreevathsa
        </p>
        <br />
        <div className="task-desc">
          <h4>Description</h4>
          <p>{selectedTask.description}</p>
        </div>
        <br />
        <div className="task-comments">
          <h4>Comments</h4>
          <p>
            Some comments git push origin feature-kanban Enumerating objects:
            13, done. Counting objects: 100% (13/13), done. Delta compression
            using up to 8 threads Compressing objects: 100% (7/7), done. Writing
            objects: 100% (7/7), 613 bytes | 613.00 KiB/s, done. Total 7 (delta
            5), reused 0 (delta 0), pack-reused 0 remote: Resolving deltas: 100%
            (5/5), completed with 5 local objects. To
            https://github.com/ShreevathsaR/zenflow.git f317a83..edf4051
            feature-kanban feature-kanban
          </p>
        </div>
      </div>
      <div className="task-details-right">
        <div className="task-avatars">
          {/* <AvatarGroup
            max={4}
            spacing={4}
            sx={{
              "& .MuiAvatar-root": {
                width: 30, // Adjust the size
                height: 30,
                fontSize: 12,
                color: "grey", // Adjust the font size for the +2 avatar
              },
            }}
          >
            <Avatar
              alt="Remy Sharp"
              src="/avatars/avatar-3.jpg"
              sx={{ width: 30, height: 30 }}
            />
            <Avatar
              alt="Travis Howard"
              src="/avatars/avatar-2.jpg"
              sx={{ width: 30, height: 30 }}
            />
            <Avatar
              alt="Cindy Baker"
              src="/avatars/avatar-1.png"
              sx={{ width: 30, height: 30 }}
            />
            <Avatar
              alt="Agnes Walker"
              src="/avatars/avatar-3.jpg"
              sx={{ width: 30, height: 30 }}
            />
            <Avatar
              alt="Trevor Henderson"
              src="/avatars/avatar-3.jpg"
              sx={{ width: 30, height: 30 }}
            />
          </AvatarGroup> */}
          <p>Assigned to:</p>
          {assignedTo}
        </div>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            jusitfyContent: "center",
            alignItems: "center",
          }}
        >
          <li className="task-detail-options" onClick={handleShowAssignModal}>
            <MdAssignmentInd />
            Assign
          </li>
          {showAssignModal && (
            <div className="assign-modal">
              <div className="assign-header-section">
                <h3>Organization members</h3>
                {/* <input></input> */}
                <button
                  style={{ color: "white" }}
                  onClick={() => {
                    setShowAssignModal(false);
                  }}
                  className="close-button"
                >
                  &times;
                </button>
              </div>

              <Select
                // defaultValue={colourOptions[0]} // Set default selected option
                isClearable // Allows the user to clear the selected option
                styles={customStyles}
                components={{ SingleValue }} // Use custom SingleValue component
                isSearchable // Enables searching within the options
                name="color"
                value={selectedCollaborator}
                options={taskCollaborators.length > 0 ? taskCollaborators : "No options"}
                onChange={handleChange} // Pass options to the select dropdown
              />
              <button
                className="assign-modal-button"
                onClick={handleTaskAssignment}
              >
                Assign
              </button>
            </div>
          )}
          <li className="task-detail-options">
            <TiAttachmentOutline />
            Attachments
          </li>
          <li className="task-detail-options">
            <TbChecklist />
            Checklist
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TaskDetails;
