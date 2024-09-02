import React, { useEffect } from 'react'
import './Page.css'
import Todo from './Todo/Todo'
import { usePageContext } from '../Contexts/PageContext'
import OrganizationHome from '../Organization/OrganizationHome'
import KanbanHome from './Kanban/KanbanHome'
import { supabase } from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'

const Page = () => {

    const {page} = usePageContext();
    const navigate = useNavigate();

    useEffect(()=>{

      const getSession = async () => {
        const session = await supabase.auth.getSession()
        console.log(session)
        if(!session){
          navigate('/login')
        }
      }
      getSession();
    },[])

  return (
    <div className='page'>
        {page === "" && <div style={{color:"white", fontSize:"x-large", display:"flex", width:"100%", height:"100%", alignItems:"center", justifyContent:"center"}}>Select a tool</div>}
        {page === "Notes" && <KanbanHome/>}
        {page === "Todo" && <Todo/>}
        {page === "OrganizationHome" && <OrganizationHome/>}
    </div>
  )
}

export default Page