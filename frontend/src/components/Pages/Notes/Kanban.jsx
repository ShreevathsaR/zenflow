import React, { useEffect, useState } from 'react'
import './Kanban.css'

const Kanban = () => {

  const [sections, setSections] = useState([])

  useEffect(() => {
    const Todo = ["Todo 1", "Todo 2", "Todo 3"]
    const Doing = ["Doing 1", "Doing 2", "Doing 3"]
    const Done = ["Done 1", "Done 2", "Done 3"]

    setSections([Todo, Doing, Done])

  }, [])



  return (
    <div className='kanban-container'>
      <div className='kanban-header'>
        <h3>Board Name</h3>
        <select>
          <option value="1">Kanban Options</option>
        </select>
      </div>
      <div className='kanban-board'>
        <ul className='kanban-sections'>
          {sections.map((section, index) => {
            return <li className='individual-section' key={index}>
              <ul className='kanban-cards'>
                {section.map((sec,index) => {
                  return <li key={index}>{sec}</li>
                })}
              </ul>
            </li>
          })}
        </ul>
      </div>
    </div>
  )
}

export default Kanban
