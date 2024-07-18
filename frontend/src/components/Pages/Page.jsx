import React, { useEffect } from 'react'
import './Page.css'
import Notes from './Notes/Notes'
import Todo from './Todo/Todo'
import { usePageContext } from '../Contexts/PageContext'

const Page = () => {

    const {page} = usePageContext();

  return (
    <div className='page'>
        {page === "" && <div style={{color:"gray", fontSize:"x-large", display:"flex", width:"100%", height:"100%", alignItems:"center", justifyContent:"center"}}>Select a tool</div>}
        {page === "Notes" && <Notes/>}
        {page === "Todo" && <Todo/>}
    </div>
  )
}

export default Page