import React, { useState } from 'react'
import './Sidebar.css'
import { SlOptions } from "react-icons/sl";
import { FaAnglesLeft } from "react-icons/fa6";
import { usePageContext } from '../Contexts/PageContext';

const Sidebar = ({setShowSideBar}) => {

    console.log(setShowSideBar)

    const {page,setPage} = usePageContext();

    const handleNotes = () => {
        setPage("Notes")
    }

    const handleTodo = () => {
        setPage("Todo")
    }

  return (
    <div className='sidebar'>
        <ul>
            <div className="closing-bar"><FaAnglesLeft onClick={()=>{setShowSideBar(false)}}/></div>
            <li onClick={handleNotes}>Notes <SlOptions/></li>
            <li onClick={handleTodo}>Todo <SlOptions/></li>
        </ul>
    </div>
  )
}

export default Sidebar