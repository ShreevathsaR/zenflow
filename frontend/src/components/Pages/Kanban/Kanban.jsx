/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useProjectContext } from "../../Contexts/ProjectContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Kanban.css";
import axios from "axios";
import TaskDetails from "./TaskDetails";
import Swal from "sweetalert2";

const Kanban = ({ value }) => {
  const [sections, setSections] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [creator, setCreator] = useState(null);


  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [newTaskSectionId, setNewTaskSectionId] = useState(null);;

  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionModal, setNewSectionModal] = useState(false);

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

    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log(error);
      } else {
        console.log(data);

        const { data: userData, error } = await supabase.from('profiles').select('id,full_name').eq('id', data.user.id).single()
        if (error) {
          console.log(error)
        }
        else {
          console.log('user data', userData)
          setCreator(userData)
        }
      }
    };

    getUser();
  }, [selectedBoard, selectedBoardId]);

  const fetchBoardData = async () => {
    //fetches board details
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
    }
    if (error) {
      console.log(error);
    }
  };

  const handleAddSection = async () => {
    setNewSectionModal(false);
    console.log(selectedBoardId);

    if(!newSectionName){
      Swal.fire({
        title: "Error",
        text: "Please enter a section name.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return
    }

    const sectionTitle = newSectionName;

    const maxPosition =
      sections.length > 0
        ? Math.max(...sections.map((section) => section.position))
        : 0;

    if (!sectionTitle) return;

    const response = await axios.post("https://zenflow-kclv.onrender.com/insertSections", {
      board_id: selectedBoardId,
      name: sectionTitle,
      position: maxPosition + 1,
    });
    if (response.status === 200) {
      console.log(response);
      fetchSectionsAndTasks();
      setNewSectionName("");
    } else {
      console.log("Error adding section");
      setNewSectionName("");
    }
  };

  const handleAddTask = async () => {
    if (!newTaskName || !newTaskDesc) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all fields",
        icon: "error",
        confirmButtonText: "OK",
      });
      setNewTaskModal(false);
      return;
    }

    const sectionId = sections.find(section => section.id === newTaskSectionId);
    console.log(sectionId);


    setNewTaskModal(false);

    const section = sections.find((sec) => sec.id === sectionId.id);

    console.log("Task adding section:", section);

    const maxTaskPosition =
      section.tasks.length > 0
        ? Math.max(...section.tasks.map((task) => task.position))
        : 0;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          section_id: sectionId.id,
          name: newTaskName,
          description: newTaskDesc,
          position: maxTaskPosition + 1,
          created_by: creator.id,
        },
      ])
      .select();
    if (error) {
      console.log(error);
      setNewTaskName("");
      setNewTaskDesc("");
    } else {
      console.log(data);
      fetchSectionsAndTasks();
      setNewTaskName("");
      setNewTaskDesc("");
    }
  };

  const fetchSectionsAndTasks = async () => {
    const { data, error } = await supabase
      .from("sections")
      .select(
        `
        id, 
        name,
        position, 
        tasks (
          id, 
          name, 
          description, 
          due_date, 
          completed,
          position  
        )
      `
      )
      .eq("board_id", selectedBoardId)
      .order("position", { ascending: true }) // Order sections by their position
      .order("position", { foreignTable: "tasks", ascending: true }); // Order tasks by their position within each section

    if (error) {
      console.log("Error fetching sections and tasks:", error.message);
    } else {
      console.log("Sections and tasks:", data);
      setSections(data); // Set the ordered sections and tasks in your state
      return data; // Return the fetched data for rendering
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    console.log("destination sec id", destination.droppableId);
    console.log("source sec id", source.droppableId);
    console.log("draggableId", draggableId);
    console.log("type", type);

    // If there's no destination, or if the position hasn't changed, do nothing
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "section") {
      // Handling reordering of sections
      const reorderedSections = reorder(
        sections,
        source.index,
        destination.index
      );
      if (reorderedSections) {
        setSections(reorderedSections);
        updateSectionOrderInDatabase(reorderedSections); // Ensure this function is correct
      } else {
        console.error("Section reordering failed.");
      }
    } else if (type === "task") {
      // Handling reordering of tasks within a section or between sections

      console.log(sections[0].id);
      const sourceSectionId = sections.find(
        (sec) => sec.id == source.droppableId
      );
      const destinationSectionId = sections.find(
        (sec) => sec.id == destination.droppableId
      );

      if (!sourceSectionId) {
        console.error("Source section not found.");
        return;
      }

      if (!destinationSectionId) {
        console.error("Destination section not found.");
        return;
      }

      // Reorder the tasks within or between sections
      const result = reorderTasks(
        sourceSectionId,
        destinationSectionId,
        source.index,
        destination.index,
        draggableId
      );

      if (result) {
        console.log("result", result);
        setSections(result.updatedSections);
        updateTaskOrderInDatabase(
          result.updatedTasks,
          sourceSectionId,
          destinationSectionId
        ); // Ensure this function is correct
      } else {
        console.error("Task reordering failed.");
      }
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const reorderTasks = (
    sourceSectionId,
    destinationSectionId,
    sourceIndex,
    destinationIndex
  ) => {
    const sourceSection = sections.find(
      (section) => section.id == sourceSectionId.id
    );
    const destinationSection = sections.find(
      (section) => section.id == destinationSectionId.id
    );

    if (!destinationSection) {
      console.error("Destination section not found.");
      return { updatedSections: sections, updatedTasks: [] };
    }

    if (sourceSection) {
      console.log("sourceSection", sourceSection);
    }

    if (destinationSection) {
      console.log("destinationSection", destinationSection);
    }

    if (!sourceSection) {
      console.error("Source section not found.");
      return { updatedSections: sections, updatedTasks: [] };
    }

    const sourceTasks = Array.from(sourceSection.tasks);
    const [removedTask] = sourceTasks.splice(sourceIndex, 1);

    const destinationTasks = Array.from(destinationSection.tasks);
    destinationTasks.splice(destinationIndex, 0, removedTask);

    const updatedSections = sections.map((section) => {
      if (section.id === sourceSectionId) {
        return { ...section, tasks: sourceTasks };
      } else if (section.id === destinationSectionId) {
        return { ...section, tasks: destinationTasks };
      }
      return section;
    });

    return { updatedSections, updatedTasks: destinationTasks };
  };

  const updateSectionOrderInDatabase = async (sections) => {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      await supabase
        .from("sections")
        .update({ position: i + 1 }) // Update the position in the database
        .eq("id", section.id);
    }
  };

  const updateTaskOrderInDatabase = async (
    tasks,
    sourceSectionId,
    destinationSectionId
  ) => {
    console.log("I am called enter final stage");

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const response = await supabase
        .from("tasks")
        .update({
          position: i + 1,
          section_id: destinationSectionId.id,
        })
        .eq("id", task.id);

      if (response.error == null) {
        console.log("Task order updated successfully");
        fetchSectionsAndTasks();
      } else {
        console.error("Error updating task order:", response.error);
      }
    }
  };

  const handleShowTaskDetails = (task) => {
    setSelectedTask(task);
    console.log(task)
    setShowTaskDetails(true);
  };

  const handleNewTaskModal = (sectionId) => {
    setNewTaskSectionId(sectionId.id);
    setNewTaskModal(true);
  };

  return (
    <div className="kanban-board-container">
      {selectedProject && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-sections"
            type="section"
            direction="horizontal"
          >
            {(provided) => {
              return (
                <div
                  className="kanban-board"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {sections.length > 0 &&
                    sections.map((section, index) => (
                      <Draggable
                        key={section.id}
                        draggableId={section.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <ul
                            className="individual-section"
                            style={{ width: "15rem" }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h3>{section.name}</h3>
                            <Droppable
                              droppableId={section.id.toString()} // Ensure section id is unique
                              type="task"
                            >
                              {(provided) => (
                                <ul
                                  className="kanban-card"
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  {section.tasks.map((task, taskIndex) => (
                                    <Draggable
                                      key={task.id.toString()}
                                      draggableId={task.id.toString()}
                                      index={taskIndex}
                                    >
                                      {(provided) => (
                                        <li
                                          className="todo"
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            cursor: "grab",
                                            ...provided.draggableProps.style,
                                          }}
                                          onClick={() => handleShowTaskDetails(task)}
                                        >
                                          {task.name}
                                        </li>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                  <div
                                    className="add-task"
                                    onClick={() => handleNewTaskModal(section)}
                                  >
                                    Add Task
                                  </div>
                                  {newTaskModal && (
                                    <div className="modal-overlay">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <h2>Add a Task</h2>
                                          <button
                                            onClick={() => {
                                              setNewTaskModal(false);
                                            }}
                                            className="close-button"
                                          >
                                            &times;
                                          </button>
                                        </div>
                                        <div className="form-group">
                                          <label htmlFor="title">Task title</label>
                                          <input
                                            type="text"
                                            id="title"
                                            value={newTaskName}
                                            className="input-field"
                                            placeholder="Enter name"
                                            onChange={(e) => setNewTaskName(e.target.value)}
                                            required
                                          />
                                          <label htmlFor="title">Task Description</label>
                                          <input
                                            type="text"
                                            id="title"
                                            value={newTaskDesc}
                                            className="input-field"
                                            placeholder="Enter description"
                                            onChange={(e) => setNewTaskDesc(e.target.value)}
                                            required
                                          />
                                        </div>
                                        <div className="modal-footer">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setNewTaskModal(false);
                                            }}
                                            className="cancel-button"
                                          >
                                            Cancel
                                          </button>
                                          <button onClick={() => handleAddTask(section)} className="submit-button">
                                            Submit
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </ul>
                              )}
                            </Droppable>
                          </ul>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  <div
                    className="section-addition"
                    onClick={() => setNewSectionModal(true)}
                  >
                    Add section
                  </div>
                  {newSectionModal && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h2>Add a Section</h2>
                          <button
                            onClick={() => {
                              setNewSectionModal(false);
                            }}
                            className="close-button"
                          >
                            &times;
                          </button>
                        </div>
                        <div className="form-group">
                          <label htmlFor="title">Section Name</label>
                          <input
                            type="text"
                            id="title"
                            value={newSectionName}
                            className="input-field"
                            placeholder="Enter name"
                            onChange={(e) => setNewSectionName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            onClick={() => {
                              setNewSectionModal(false);
                            }}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                          <button onClick={() => handleAddSection()} className="submit-button">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>

                  )}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      )}
      {showTaskDetails && (
        <div className="task-details">
          <div className="modal-overlay">
            <div className="details-modal-content">
              <div className="modal-header">
                {/* <h2>{selectedTask.name}</h2> */}
                <TaskDetails value={{ selectedTask, setSelectedTask }} />
                <button
                  style={{ color: "white" }}
                  onClick={() => {
                    setShowTaskDetails(false);
                  }}
                  className="close-button"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kanban;
