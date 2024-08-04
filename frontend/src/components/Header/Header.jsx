import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
        <h2 className='home-title'>ZenFlow</h2>
        <div className='nav-components'>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
        </div>
    </div>
  )
}

export default Header