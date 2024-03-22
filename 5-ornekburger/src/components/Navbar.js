import React from 'react'
import Logo from '../assets/logo.png'
import { Link, NavLink } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() {

  return (
    <div className='navbar'>
        <div className='main'>
        <Link to='/'>
            <img src={Logo} alt=""/> 
        </Link>
            <div className='menus'>
                <NavLink to={'/'}>Home</NavLink>
                <NavLink to={'/menu'}>Menu</NavLink>
                <NavLink to={'/about'}>About Us</NavLink>
                <NavLink to={'/contact'}>Contact</NavLink>
            </div>
        </div>
    </div>
  )
}

export default Navbar