import React from 'react';
import MenuItem from './MenuItem';
import { Datas } from '../helpers/Datas';


function Menu() {
  const eachItem = Datas.map((data, index) => {
    return <MenuItem items={data} key={index} />
  })

  return (
    <div className='menu'>
      <div className='card'>
        {eachItem}
      </div>
    </div>

  )
}

export default Menu