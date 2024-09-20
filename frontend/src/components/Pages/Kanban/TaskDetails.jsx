import React from "react";
import './TaskDetails.css';

const TaskDetails = ({ value }) => {

  const { selectedTask, setSelectedTask } = value;
  console.log(selectedTask);

  return (
  <div className="task-details-wrapper">
    <h3>{selectedTask.name}</h3>
    <p>in <u>section</u></p>
    <div className="task-desc">
        <h4>Description</h4>
        <p>{selectedTask.description}</p>
    </div>
  </div>
);
};

export default TaskDetails;
