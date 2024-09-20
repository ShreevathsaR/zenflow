return (
    <div className="kanban-container"> {/* Restore outer container */}
      <div className="kanban-board-container">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-sections" type="section" direction="horizontal">
            {(provided) => (
              <ul
                className="kanban-sections"  // Add this class back
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {sections.map((section, index) => (
                  <Draggable
                    key={section.id}
                    draggableId={`section-${section.id}`} // Ensure unique IDs
                    index={index}
                  >
                    {(provided) => (
                      <li
                        className="individual-section"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ width: "15rem", ...provided.draggableProps.style }}
                      >
                        <h3>{section.name}</h3>
                        <Droppable droppableId={`tasks-${section.id}`} type="task">
                          {(provided) => (
                            <ul
                              className="kanban-card"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {section.tasks.map((task, taskIndex) => (
                                <Draggable
                                  key={task.id}
                                  draggableId={`task-${task.id}`} // Ensure unique IDs
                                  index={taskIndex}
                                >
                                  {(provided) => (
                                    <li
                                      className="todo"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{ cursor: "grab", ...provided.draggableProps.style }}
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
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <div className="section-addition" onClick={handleAddSection}>
                  Add section
                </div>
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
  