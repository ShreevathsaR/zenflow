import React, { useEffect } from 'react'
import './Inbox.css'
import { supabase } from '../../../supabaseClient'

const Inbox = () => {

  useEffect(()=>{
    getUser();
    console.log('hi')
  },[])

  const getUser = async() => {
    const {data,error} =await supabase.from('profiles').select('*').eq('email','shreevathsar2002@gmail.com').single();
    if(error){
      console.log(error);
      return
    }
    console.log(data);
  }


  return (
    <div className='inbox-page'>
      <div className="inbox-header">
        <h3>Inbox</h3>
      </div>
      <div className='inbox-container'>
          <ul>
            <li className='inbox-message'>You are invited to an organization<div className='btn-container'><button>Accept</button><button>Reject</button></div></li>
            <li className='inbox-message'>You are invited to an organization</li>
          </ul>
      </div>
    </div>
  )
}

export default Inbox