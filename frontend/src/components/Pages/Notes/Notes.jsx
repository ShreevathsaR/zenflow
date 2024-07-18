import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import "./Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState([]);
  const [modal, setModal] = useState(false);
  const [title,setTitle] = useState("");
  const [desc,setDesc] = useState("");

  const handleCreateNote = () => {
    setNote([title,desc]);
    setNotes(...notes, note);
    console.log(notes)
    setTitle("")
    setDesc("")
  };

  return (
    <div className="notes-page">
      <div className="notes-container">
        <div onClick={()=>{setModal(true)}} className="add-note">
          <IoIosAddCircleOutline />
          Click here to add a note
        </div>
        {modal && (
          <div className="modal-bg">
            <div className="modal">
                <input value={title} placeholder="Title" onChange={(e)=>{setTitle(e.target.value)}}/>
                <input value={desc} placeholder="Description" onChange={(e)=>{setDesc(e.target.value)}}/>
                <button onClick={handleCreateNote}>Create</button>
            </div>
          </div>
        )}
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default Notes;
