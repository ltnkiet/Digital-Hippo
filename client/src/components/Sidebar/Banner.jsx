import React from 'react'
import imgBanner from '../../asset/img/thumbnail.jpg'

const Banner = () => {
  return (
    <div className='w-full h-full'>
      <img src={imgBanner} alt="Banner" className='w-full h-full object-cover' />
    </div>
  )
}

export default Banner