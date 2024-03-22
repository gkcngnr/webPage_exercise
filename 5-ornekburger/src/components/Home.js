import React from 'react';
import '../styles/Home.css'
import { Link } from 'react-router-dom';



function Home() {
  return (
    <div className='home'>
      <div className='homeContent'> 
        <Link to='menu'>Order Now</Link>
      </div>
    
    </div>
  )
}

export default Home