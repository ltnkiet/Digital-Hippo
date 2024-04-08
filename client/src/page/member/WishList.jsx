import React from 'react'
import { ProductCard } from 'components'
import { useSelector } from 'react-redux'

const WishList = () => {
  const {current} = useSelector((s) => s.user)
  return (
    <div className="w-full relative px-4">
      <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
        Danh sách yêu thích
      </header>
      <div className="p-4 w-full flex flex-wrap gap-4">
        {current?.wishlist?.map((el) => (
          <div
            className="bg-white rounded-md w-[300px] drop-shadow flex flex-col py-3 gap-3"
            key={el._id}
          >
            <ProductCard pid={el._id} data={el} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishList