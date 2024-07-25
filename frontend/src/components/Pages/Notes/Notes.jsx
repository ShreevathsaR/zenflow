import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { PiDotsThreeBold } from "react-icons/pi";
import "./Notes.css";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { BsFillPinAngleFill } from "react-icons/bs";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedNoteTitle, setSelectedNoteTitle] = useState("");
  const [selectedNoteDesc, setSelectedNoteDesc] = useState("");
  const [optionsModal, setOptionsModal] = useState(false);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [showHoverOptions, setShowHoverOptions] = useState(true);
  const [pinnedNotes,setPinnedNotes] = useState([]);

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
    console.log("I just ran");
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

  const toggleShowNoteModal = () => {
    setOptionsModal((prev) => !prev);
  };

  const handleShowNote = (note) => {
    setShowNoteModal(true);
    setSelectedNoteTitle(note[0]);
    setSelectedNoteDesc(note[1]);
    setSelectedNoteIndex(notes.indexOf(note));
  };

  const deleteNote = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        notes.splice(selectedNoteIndex, 1);

        let fetchedLocalNotes = localStorage.getItem("Notes");

        const fetchedNotesParsed = JSON.parse(fetchedLocalNotes);

        if (
          fetchedNotesParsed &&
          fetchedNotesParsed.length > selectedNoteIndex
        ) {
          fetchedNotesParsed.splice(selectedNoteIndex, 1);
        }

        const updatedStoredNotes = JSON.stringify(fetchedNotesParsed);

        localStorage.setItem("Notes", updatedStoredNotes);
        setOptionsModal(false);
        setShowNoteModal(false);

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        setOptionsModal(false);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
      setOptionsModal(false);
    });
  };

  const pinThisNote = (index) => {
    console.log({index});

    if(index > -1){
      const arrayForPinning = [...notes];
      arrayForPinning.splice(index,1)

      arrayForPinning.unshift(notes[index])

      setNotes(arrayForPinning)

      localStorage.setItem("Notes", JSON.stringify(arrayForPinning));
    }
  };

  const deleteNoteHome = (index) => {
        console.log("Deleted elements", notes[index]);
        
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {

            const notesArrayForMod = [...notes]
            notesArrayForMod.splice(index, 1);
            setNotes(notesArrayForMod)
    
            let fetchedLocalNotes = localStorage.getItem("Notes");
    
            const fetchedNotesParsed = JSON.parse(fetchedLocalNotes);
    
            if (
              fetchedNotesParsed &&
              fetchedNotesParsed.length > index
            ) {
              fetchedNotesParsed.splice(index, 1);
            }
    
            const updatedStoredNotes = JSON.stringify(fetchedNotesParsed);
    
            localStorage.setItem("Notes", updatedStoredNotes);
            setOptionsModal(false);
            setShowNoteModal(false);
    
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            setOptionsModal(false);
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire({
              title: "Cancelled",
              text: "Your imaginary file is safe :)",
              icon: "error",
            });
          }
          setOptionsModal(false);
        });
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
              {showHoverOptions && (
                <div className="hover-options">
                  <MdDelete
                    onClick={() => {
                      deleteNoteHome(index);
                    }}
                  />
                  <BsFillPinAngleFill
                    onClick={() => {
                      pinThisNote(index);
                    }}
                  />
                </div>
              )}
              <div
                onClick={() => {
                  handleShowNote(note);
                }}
              >
                <h4 className="note-title">{note[0]}</h4>
                <p className="note-desc">{note[1]}</p>
              </div>
            </li>
          ))}
        </ul>
        {showNoteModal && (
          <div className="modal-bg">
            <div className="note-modal" style={{ backgroundColor: "white" }}>
              <div className="modal-close-btn">
                <div className="note-modal-options">
                  <PiDotsThreeBold
                    onClick={() => {
                      toggleShowNoteModal();
                    }}
                  />
                </div>
                <IoClose
                  onClick={() => {
                    setShowNoteModal(false);
                  }}
                />
                {optionsModal && (
                  <ul>
                    <li>Edit</li>
                    <li
                      onClick={() => {
                        deleteNote();
                      }}
                    >
                      Delete
                    </li>
                    <li>Pin</li>
                  </ul>
                )}
              </div>
              <h4 className="note-title">{selectedNoteTitle}</h4>
              <p className="note-desc">{selectedNoteDesc}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
