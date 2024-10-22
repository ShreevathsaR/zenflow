import React, { useEffect, useState } from 'react'
import './Inbox.css'
import { supabase } from '../../../supabaseClient'
import { useNotifications} from '../../Contexts/NotificationContext';

const Inbox = () => {

  // const {values} = notificationValues
  const {notifications, setNotifications} = useNotifications();
  const [inboxNotifications, setInboxNotifications] = useState([]);
  const [notificationType, setNotificationType] = useState('message');


  useEffect(()=>{
    
    if(notifications.length > 0){
      notifications.map((notification)=>{
        notification.type == 'task_assignment' && (
          setInboxNotifications([notification]),
          setNotificationType('Assignment')
        )
      })
      console.log(notifications); 
    }
    getUser();
  },[notifications])

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
          {/* <ul>
            <li className='inbox-message'>You are invited to an organization<div className='btn-container'><button>Accept</button><button>Reject</button></div></li>
            <li className='inbox-message'>You are invited to an organization</li>
          </ul> */}
          <ul>
            {notificationType == 'Assignment' && inboxNotifications.map((notification, index)=>{
             return <li key={index} className='inbox-message'>You are assigned to a task {notification.taskName} by {notification.taskCreatedBy}</li>
            })}
          </ul>
      </div>
    </div>
  )
}

export default Inbox