import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useProjectContext } from "../../Contexts/ProjectContext";
import "./Kanban.css";
import axios from "axios";

const Kanban = ({ value }) => {
  const [sections, setSections] = useState([]);
  const [tasks, setTasks] = useState([]);

  const {
    selectedBoard,
    setSelectedBoard,
    selectedBoardId,
    setSelectedBoardId,
  } = value;

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
    // fetchSections();
    fetchSectionsAndTasks();
    // console.log(selectedBoard);
    // console.log(selectedBoardId);
    // console.log(value)
  }, [selectedBoard, selectedBoardId]);

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

  const handleAddSection = async () => {
    console.log(selectedBoardId);
    const sectionTitle = prompt("Enter a section title");

    if (!sectionTitle) return;

    const response = await axios.post("http://localhost:8000/insertSections", {
      board_id: selectedBoardId,
      name: sectionTitle,
      position: 3,
    });
    if (response.status === 200) {
      console.log(response);
      fetchSectionsAndTasks();
    } else {
      console.log("Error adding section");
    }
  };

  const handleAddTask = async (sectionId) => {
    const newTask = prompt("Enter a task");
    if (!newTask) return;
    console.log(sectionId.id);

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          section_id: sectionId.id,
          name: newTask,
          position: 1,
        },
      ])
      .select();
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      fetchSectionsAndTasks();
    }
  };

  // const fetchSections = async () => {
  //   const { data, error } = await supabase
  //     .from("boards")
  //     .select("id")
  //     .eq("name", selectedBoard)
  //     .single();
  //   const board_id = data.id;

  //   if (error) {
  //     console.log(error);
  //     return;
  //   } else {
  //     const { data, error } = await supabase
  //       .from("sections")
  //       .select("*")
  //       .eq("board_id", board_id);
  //     setSections(data);
  //     // console.log("Sections:", data);
  //   }
  //   if (error) {
  //     console.log(error);
  //   }
  // };

  const fetchTasks = async (sectionId) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("section_id", sectionId.id);
    setTasks(data);
    console.log(data);
  };

  const fetchSectionsAndTasks = async () => {
    const { data, error } = await supabase
      .from('sections')
      .select(`
        id, 
        name,
        tasks (
          id, 
          name, 
          description, 
          due_date, 
          completed
        )
      `)
      .eq('board_id', selectedBoardId); // Remove ordering by 'position'
  
    if (error) {
      console.log('Error fetching sections and tasks:', error.message);
    } else {
      console.log('Sections and tasks:', data);
      setSections(data)
      return data; // Return the fetched data for rendering
    }
  };

  return (
    <div className="kanban-container">
      <div className="kanban-board">
        <ul className="kanban-sections">
          {sections.map((section, index) => {
            return (
              <li className="individual-section" key={index}>
                <ul className="kanban-card">
                  <h3>{section.name}</h3>
                  {section.tasks.map((taskDetails, index) => {
                    return (
                      <li className="todo" key={index} draggable="true">
                        {taskDetails.name}
                      </li>
                    );
                  })}
                  <div
                    className="add-task"
                    onClick={() => {
                      handleAddTask(section);
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
