import React from "react";
import "./TaskDetails.css";

const TaskDetails = ({ value }) => {
  const { selectedTask, setSelectedTask } = value;

  return (
  <div className="task-details-wrapper">
    {selectedTask.name}
    </div>
  );
};
export default TaskDetails;
