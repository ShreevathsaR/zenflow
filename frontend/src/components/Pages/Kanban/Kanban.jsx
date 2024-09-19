/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useProjectContext } from "../../Contexts/ProjectContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
    console.log(selectedBoardId);
    const sectionTitle = prompt("Enter a section title");

    const maxPosition =
      sections.length > 0
        ? Math.max(...sections.map((section) => section.position))
        : 0;

    if (!sectionTitle) return;

    const response = await axios.post("http://localhost:8000/insertSections", {
      board_id: selectedBoardId,
      name: sectionTitle,
      position: maxPosition + 1,
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
          name: newTask,
          position: maxTaskPosition + 1,
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

    console.log("destination sec index", destination.index);
    console.log("source sec index", source.index);

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
              console.log("Droppable rendered with id: all-sections");
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
                                        >
                                          {task.name}
                                        </li>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                  <div
                                    className="add-task"
                                    onClick={() => handleAddTask(section)}
                                  >
                                    Add Task
                                  </div>
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
                    onClick={() => handleAddSection()}
                  >
                    Add section
                  </div>
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default Kanban;
