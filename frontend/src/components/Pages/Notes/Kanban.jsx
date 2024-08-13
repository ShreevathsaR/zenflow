import React, { useEffect, useState } from "react";
import "./Kanban.css";

const Kanban = () => {
  const [sections, setSections] = useState([]);

  const Todo = {
    title: "Todo",
    tasks: ["task1", "task2", "task3"],
  };

  const Doing = {
    title: "Doing",
    tasks: [],
  };

  const Done = {
    title: "Done",
    tasks: [],
  };

  useEffect(() => {
    setSections([Todo, Doing, Done]);
    const localsections = JSON.parse(localStorage.getItem("sections"));
    if (localsections) {
      setSections(localsections);
    }
  }, []);

  const handleAddSection = () => {
    const sectionTitle = prompt("Enter a section title");

    if (!sectionTitle) return;
    setSections([...sections, { title: sectionTitle, tasks: [] }]);
    localStorage.setItem("sections", JSON.stringify(sections));

  };

  const handleAddTask = (index) => {

    const newTask = prompt("Enter a task");
    if (!newTask) return;

    const sectionToAddTask = [...sections];

    sectionToAddTask[index].tasks.push(newTask);

    setSections(sectionToAddTask);

    localStorage.setItem("sections", JSON.stringify(sections));
  }

  return (
    <div className="kanban-container">
        <div className="kanban-header">
          <h3>Board Name</h3>
          <select>
            <option value="1">Kanban Options</option>
          </select>
        </div>
      <div className="kanban-board">
        <ul className="kanban-sections">
          {sections.map((section, index) => {
            return (
              <li className="individual-section" key={index}>
                <ul className="kanban-card">
                  <h3>{section.title}</h3>
                  {section.tasks.map((sec, index) => {
                    return (
                      <li className="todo" key={index} draggable="true">
                        {sec}
                      </li>
                    );
                  })}
                  <div className="add-task" onClick={() => { handleAddTask(index) }}>Add Task</div>
                </ul>
              </li>
            );
          })}
          <div
            className="section-addition"
            onClick={() => {
              handleAddSection();
            }}
          >
            Add section
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Kanban;
