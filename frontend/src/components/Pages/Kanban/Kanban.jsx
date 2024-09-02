import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useProjectContext } from "../../Contexts/ProjectContext";
import "./Kanban.css";
import axios from "axios";

const Kanban = ({ value }) => {
  const [sections, setSections] = useState([]);

  const { selectedBoard, setSelectedBoard, selectedBoardId, setSelectedBoardId } = value;

  const { selectedProject, setSelectedProject } = useProjectContext();

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
    fetchBoardData();
    fetchSections();
    // console.log(selectedBoard);
    // console.log(selectedBoardId);
    // console.log(value)
  }, [selectedBoard]);

  const fetchBoardData = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id")
      .eq("name", selectedProject)
      .single();
    const project_id = data.id;
    if (error) {
      console.log(error);
      return;
    } else {
      const { data, error } = await supabase
        .from("boards")
        .select("name")
        .eq("project_id", project_id);
      // console.log(data);
    }
    if (error) {
      console.log(error);
    }
  };

  const handleAddSection = async() => {
    console.log(selectedBoardId)
    const sectionTitle = prompt("Enter a section title");

    if (!sectionTitle) return;
    
    const response = await axios.post("http://localhost:8000/insertSections", {
      board_id: selectedBoardId,
      name: sectionTitle,
      position:3
    });
    if(response.status === 200){
      console.log(response);
      fetchSections();
    } else {
      console.log("Error adding section")
    }
  };

  // const handleAddTask = (index) => {

  //   const newTask = prompt("Enter a task");
  //   if (!newTask) return;

  //   const sectionToAddTask = [...sections];

  //   sectionToAddTask[index].tasks.push(newTask);

  //   setSections(sectionToAddTask);

  //   localStorage.setItem("sections", JSON.stringify(sections));
  // }

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from("boards")
      .select("id")
      .eq("name", selectedBoard)
      .single();
    const board_id = data.id;
    // console.log(board_id);

    if (error) {
      console.log(error);
      return;
    } else {
      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .eq("board_id", board_id);
      setSections(data);
      // console.log("Sections:", data);
    }
    if (error) {
      console.log(error);
    }
  };

  return (
    <div className="kanban-container">
      <div className="kanban-board">
        <ul className="kanban-sections">
          {/* {sections.map((section, index) => {
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
          })} */}
          {sections.map((section, index) => {
            return (
              <li className="individual-section" key={index}>
                <ul className="kanban-card">
                  <h3>{section.name}</h3>
                  {/* {section.tasks.map((sec, index) => {
                    return (
                      <li className="todo" key={index} draggable="true">
                        {sec}
                      </li>
                    );
                  })} */}
                  <div
                    className="add-task"
                    onClick={() => {
                      handleAddTask(index);
                    }}
                  >
                    Add Task
                  </div>
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
