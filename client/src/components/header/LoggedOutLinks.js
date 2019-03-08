import React from 'react'
import { NavLink } from 'react-router-dom'

const LoggedOutLinks = () => {
  return (
    <div>
      <ul className="right">
        <li className="sliding-middle-out"><NavLink to='/register'>Register</NavLink></li>
        <li className="sliding-middle-out"><NavLink to='/login'>Login</NavLink></li>
      </ul>
    </div>
  )
}

export default LoggedOutLinks
