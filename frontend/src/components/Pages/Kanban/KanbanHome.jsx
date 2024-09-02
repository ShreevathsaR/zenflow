import React, { useEffect, useState } from "react";
import "./Kanban.css";
import "./KanbanHome.css";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { InfinitySpin } from "react-loader-spinner";
import { useProjectContext } from "../../Contexts/ProjectContext";
import { useOrganization } from "../../Contexts/OrganizationContext";
import { supabase } from "../../../supabaseClient";
import Kanban from "./Kanban";

const KanbanHome = () => {
  const [organizations, setOrganizations] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(false);

  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const { selectedOrganization, setSelectedOrganization } = useOrganization();
  const { selectedProject, setSelectedProject } = useProjectContext();

  useEffect(() => {
    fetchData();
    handleFetchBoards();
  }, [selectedOrganization, selectedProject]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProjects(), fetchOrganizations()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    const userId = localStorage.getItem("currentUserId");

    const response = await axios.get("http://localhost:8000/organizations", {
      params: { id: userId },
    });
    const organizationsData = response.data;
    const fetchedOrganizations = organizationsData.map((organization) => {
      return organization.name;
    });

    setOrganizations(fetchedOrganizations);
  };

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("organizations")
      .select("id")
      .eq("name", selectedOrganization)
      .single();
    const fetchOrgId = data.id;

    const fetchedOrgProjects = await supabase
      .from("projects")
      .select("name")
      .eq("organization_id", fetchOrgId);
    setProjects(fetchedOrgProjects.data);
    // console.log(projects);
  };

  const handleSelectOrgChange = (event) => {
    const selectedOrg = event.target.value;
    setSelectedOrganization(selectedOrg);
    console.log("Selected Organization:", selectedOrg); // For debugging
  };

  const handleSelectProjectChange = (event) => {
    const selectedPro = event.target.value;
    setSelectedProject(selectedPro);
    console.log("Selected Project:", selectedPro); // For debugging
  };

  const handleFetchBoards = async () => {
    console.log(selectedProject);
    const { data: id } = await supabase
      .from("projects")
      .select("*")
      .eq("name", selectedProject)
      .single();
    const selectedProjectId = id.id;

    const { data } = await supabase
      .from("boards")
      .select("name, id, created_at")
      .eq("project_id", selectedProjectId);
    // console.log(data)
    const boards = data.map((board) => {
      return board;
    });
    setBoards(boards);
    setSelectedBoard(boards[0].name);
    setSelectedBoardId(boards[0].id);
  };

  const handleBoardClick = (selectedBoard, selectedBoardId) => {
    // setSelectedProject(selectedBoard);
    console.log("Selected Board:", selectedBoard);
    setSelectedBoard(selectedBoard);
    setSelectedBoardId(selectedBoardId);
  };

  const handleBoardCreate = async () => {
    const board_name = prompt("Enter board name");

    if (!board_name) {
      return;
    } else {
      const { data: projectId, error: projectIdError } = await supabase
        .from("projects")
        .select("id")
        .eq("name", selectedProject)
        .single();
      if (projectIdError) {
        console.log(projectIdError);
      } else {
        const selectedProjectId = projectId.id;
        const { data, error } = await supabase.from("boards").insert([
          {
            name: board_name,
            project_id: selectedProjectId,
          },
        ]);
        if (error) {
          console.log(error);
        } else {
          console.log(data);
          handleFetchBoards();
        }
      }
    }
  };

  return (
    <div className="kanban-container">
      {loading && (
        <div className="modal-overlay">
          <div className="spinner-container">
            <InfinitySpin
              visible={true}
              width="200"
              ariaLabel="infinity-spin-loading"
              color="rgba(73, 76, 212, 1)"
            />
          </div>
        </div>
      )}
      <div className="kanban-header">
        <div style={{ display: "flex", gap: "2rem" }}>
          <h3>Kanban Overview</h3>
          <select
            className="organization-select"
            value={selectedOrganization}
            onChange={handleSelectOrgChange}
          >
            {organizations.map((organization, index) => {
              return (
                <option key={index} value={organization}>
                  {organization}
                </option>
              );
            })}
          </select>
          <select
            className="project-select"
            value={selectedProject}
            onChange={handleSelectProjectChange}
          >
            {projects.map((project, index) => {
              return (
                <option key={index} value={project.name}>
                  {project.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="board-header">
        {/* {selectedBoard && (<h3 style={{color:"white"}}>{selectedBoard}</h3>)} */}
        <ul>
          {boards.map((board, index) => {
            return (
              <li
                onClick={() => {
                  handleBoardClick(board.name, board.id);
                }}
                className={
                  selectedBoard === board.name
                    ? "selected-board-li"
                    : "boards-li"
                }
                key={index}
              >
                {board.name}
              </li>
            );
          })}
        </ul>
        <button
          style={{
            backgroundColor: "#184365",
            color: "white",
            padding: "0.5rem",
            display: "flex",
            gap: "0.7rem",
            alignItems: "center",
            // border:"1px solid #f0f0f0",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "600",
          }}
          onClick={() => {
            handleBoardCreate();
          }}
        >
          Create a Board
          <IoMdAdd />
        </button>
      </div>
      <div className="board-content">
        {selectedBoard && (
          <Kanban
            value={{
              selectedBoard,
              setSelectedBoard,
              selectedBoardId,
              setSelectedBoardId,
            }}
          />
        )}
        {!selectedBoard && (
          <p
            style={{
              color: "white",
              display: "flex",
              justifyContent: "center",
              paddingTop: "5rem",
            }}
          >
            Please create a board
          </p>
        )}
      </div>
    </div>
  );
};

export default KanbanHome;
