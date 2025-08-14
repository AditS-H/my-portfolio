// src/components/Navbar.jsx
import React from 'react'
import './Navbar.css'

const Navbar = () => {
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">Adit Sharma</div>
      <ul className="nav-links">
        <li><a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')}>Home</a></li>
        <li><a href="Adit_resume.pdf" download>Resume</a></li>
        <li><a href="#skills" onClick={(e) => handleSmoothScroll(e, 'skills')}>Skills</a></li>
        <li><a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>Contact</a></li>
      </ul>
    </nav>
  )
}

export default Navbar