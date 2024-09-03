
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()

  function reloadPage(){
    navigate(0)
  }
  return (
    <div className="header-container">
        <div className="header">
            <h1 className='header-title' onClick={reloadPage}>CURD PROJECT</h1>
        </div>
    </div>
  )
}

export default Header