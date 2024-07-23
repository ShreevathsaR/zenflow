import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import "./Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const storedNotes = localStorage.getItem("Notes");
    if (storedNotes) {
      try {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Failed to parse stored notes:", error);
        setNotes([]);
      }
    }
  }, []);

  const handleCreateNote = async () => {
    if (title.length == 0) {
      alert("Please enter a title for your note");
    } else if (desc.length == 0) {
      alert("Please enter a desc for your note");
    } else {
      const note = [title, desc];
      const updatedNotes = [note, ...notes];
      setNotes(updatedNotes);
      console.log(notes);
      setTitle("");
      setDesc("");
      localStorage.setItem("Notes", JSON.stringify(updatedNotes));
    }
    setModal(false);
  };

  return (
    <div className="notes-page">
      <div className="notes-container">
        <div
          onClick={() => {
            setModal(true);
          }}
          className="add-note"
        >
          <IoIosAddCircleOutline />
          Click here to add a note
        </div>
        {modal && (
          <div className="modal-bg">
            <div className="modal">
              <div className="modal-close-btn">
                <IoClose
                  onClick={() => {
                    setModal(false);
                  }}
                />
              </div>
              <input
                value={title}
                placeholder="Title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <input
                value={desc}
                placeholder="Description"
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
              />
              <button onClick={handleCreateNote}>Create</button>
            </div>
          </div>
        )}
        <ul>
          {notes.map((note, index) => (
            <li key={index}>
              <h4 className="note-title">{note[0]}</h4>
              <p className="note-desc">{note[1]}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notes;
