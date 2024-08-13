import React, { useEffect } from 'react'
import './Page.css'
import Todo from './Todo/Todo'
import { usePageContext } from '../Contexts/PageContext'
import Kanban from './Notes/Kanban'
import OrganizationHome from '../Organization/OrganizationHome'

const Page = () => {

    const {page} = usePageContext();

  return (
    <div className='page'>
        {page === "" && <div style={{color:"white", fontSize:"x-large", display:"flex", width:"100%", height:"100%", alignItems:"center", justifyContent:"center"}}>Select a tool</div>}
        {page === "Notes" && <Kanban/>}
        {page === "Todo" && <Todo/>}
        {page === "OrganizationHome" && <OrganizationHome/>}
    </div>
  )
}

export default Page