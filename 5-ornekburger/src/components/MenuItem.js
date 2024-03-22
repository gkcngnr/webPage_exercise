import React from 'react'
import '../styles/MenuItem.css'

function MenuItem( {items} ) {
  return (

    <div className='cardBody'>
        <h1>{items.name}</h1>
        <img src={items.image} alt="" />
        <h5 className='menuContent'>{items.content}</h5>
        <p className='price'>Price: {items.price}TL</p>
    </div>

  )
}

export default MenuItem