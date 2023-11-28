import React from 'react'
import imgBanner from '../asset/img/thumbnail.jpg'

const Banner = () => {
  return (
    <div className='w-full'>
      <img src={imgBanner} alt="Banner" className='w-full object-contain' />
    </div>
  )
}

export default Banner