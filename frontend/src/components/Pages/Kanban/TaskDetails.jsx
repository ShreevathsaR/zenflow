import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import './TaskDetails.css';
import { MdAssignmentInd } from "react-icons/md";
import { TiAttachmentOutline } from "react-icons/ti";
import { TbChecklist } from "react-icons/tb";
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';


const TaskDetails = ({ value }) => {

  const { selectedTask, setSelectedTask } = value;

  const [taskSectionName, setTaskSectionName] = useState(null);

  console.log(selectedTask);

  useEffect(() => {
    selectedTask && getTaskDetails();
  }, []);

  const getTaskDetails = async () => {
    try {
      const { data, error } = await supabase.from("tasks").select("*").eq("id", selectedTask.id);
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

  return (
    <div className="task-details-wrapper">
      <div className="task-details-left">
        <h3>{selectedTask.name}</h3>
        <p>in <u>{taskSectionName}</u></p>
        <p style={{color:"grey", fontSize:"0.75rem", opacity:"0.9"}}>created at 7th Sept</p>
        <p style={{color:"grey", fontSize:"0.75rem", opacity:"0.9"}}>added by Shreevathsa</p>
        <br />
        <div className="task-desc">
          <h4>Description</h4>
          <p>{selectedTask.description}</p>
        </div>
        <br />
        <div className="task-comments">
          <h4>Comments</h4>
          <p>Some comments git push origin feature-kanban
            Enumerating objects: 13, done.
            Counting objects: 100% (13/13), done.
            Delta compression using up to 8 threads
            Compressing objects: 100% (7/7), done.
            Writing objects: 100% (7/7), 613 bytes | 613.00 KiB/s, done.
            Total 7 (delta 5), reused 0 (delta 0), pack-reused 0
            remote: Resolving deltas: 100% (5/5), completed with 5 local objects.
            To https://github.com/ShreevathsaR/zenflow.git
            f317a83..edf4051  feature-kanban  feature-kanban
          </p>
        </div>
      </div>
      <div className="task-details-right">
        <div className="task-avatars">
          <AvatarGroup max={4} spacing={4} sx={{
            '& .MuiAvatar-root': {
              width: 30,  // Adjust the size
              height: 30,
              fontSize: 12,
              color:"grey" // Adjust the font size for the +2 avatar
            },
          }}>
            <Avatar alt="Remy Sharp" src="/avatars/avatar-3.jpg" sx={{ width: 30, height: 30 }} />
            <Avatar alt="Travis Howard" src="/avatars/avatar-2.jpg" sx={{ width: 30, height: 30 }} />
            <Avatar alt="Cindy Baker" src="/avatars/avatar-1.png" sx={{ width: 30, height: 30 }} />
            <Avatar alt="Agnes Walker" src="/avatars/avatar-3.jpg" sx={{ width: 30, height: 30 }} />
            <Avatar alt="Trevor Henderson" src="/avatars/avatar-3.jpg" sx={{ width: 30, height: 30 }} />
          </AvatarGroup>
        </div>
        <ul style={{ display: "flex", flexDirection: "column", gap: "7px", jusitfyContent: "center", alignItems: "center" }}>
          <li className="task-detail-options"><MdAssignmentInd />Assign</li>
          <li className="task-detail-options"><TiAttachmentOutline />Attachments</li>
          <li className="task-detail-options"><TbChecklist />Checklist</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskDetails;
