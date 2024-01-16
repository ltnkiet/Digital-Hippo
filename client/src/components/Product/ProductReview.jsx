import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { VoteBar, ButtonV2, VoteOption, Comment } from 'components'
import { showModal } from 'store/app/appSlice'
import { renderStar } from 'utils/helpers'
import { apiRatings } from 'api'
import Swal from 'sweetalert2'
import path from 'utils/path'
const ProductReview = ({ totalRating, rating, nameProduct, pid, rerender }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoggedIn } = useSelector(state => state.user)

  const handleSubmitVoteOption = async ({ comment, score }) => {
    if (!comment || !pid || !score) {
      alert('Please vote when click submit')
      return
    }
    const res = await apiRatings({ star: score, comment, pid, updatedAt: Date.now() })
    console.log(res)
    dispatch(showModal({ isShowModal: false, modalChildren: null }))
    rerender()
  }
  const handleVoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
          text: 'Vui lòng đăng nhập để đánh giá',
          cancelButtonText: 'Hủy',
          confirmButtonText: 'Đăng nhập',
          title: 'Khoan!',
          showCancelButton: true,
      }).then((rs) => {
        if (rs.isConfirmed) navigate(`/${path.LOGIN}`)
      })
    } else {
      dispatch(showModal({
          isShowModal: true, 
          modalChildren: 
            <VoteOption
              nameProduct={nameProduct}
              handleSubmitVoteOption={handleSubmitVoteOption}
            />
      }))
    }
}
  return (
    <div>
      <div className='flex flex-col py-8 w-main'>
        <div className='flex border'>
          <div className='flex-3 flex-col flex items-center justify-center border border-main'>
            <span className='font-semibold text-3xl'>{`${totalRating}/5`}</span>
            <span className='flex items-center gap-1'>{renderStar(totalRating)?.map((el, index) => (
              <span key={index}>{el}</span> ))}
            </span>
            <span className='text-sm'>{`${rating?.length} lượt đánh giá`}</span>
          </div>
          <div className='flex-5 flex gap-2 flex-col p-4'>
            {Array.from(Array(5).keys()).reverse().map(el => (
              <VoteBar
                key={el}
                number={el + 1}
                ratingTotal={rating?.length}
                ratingCount={rating?.filter(i => i.star === el + 1)?.length}
              />
            ))}
          </div>
        </div>
        <div className='p-4 flex items-center justify-center text-sm flex-col gap-2'>
          <span>Để lại đánh giá của bạn</span>
          <ButtonV2 handleOnClick={handleVoteNow}>Đánh giá ngay!</ButtonV2>
        </div>
        <div className='flex flex-col gap-4'>
          {rating?.map(el => (
            <Comment
                key={el._id}
                star={el.star}
                updatedAt={el.updatedAt}
                comment={el.comment}
                image={el.postBy?.avatar}
                name={el.postBy?.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductReview