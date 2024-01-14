import React from 'react'
import { Thumbnail } from '../../asset/img'

const Banner = () => {
  return (
    <div className='w-full h-full'>
      <img src={Thumbnail} alt="Banner" className='w-full h-full object-cover' />
    </div>
  )
}

export default Banner