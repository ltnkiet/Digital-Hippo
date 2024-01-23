import React, { memo, Fragment, useState } from "react"
// import avatar from "assets/avatarDefault.png"
// import { memberSidebar } from "ultils/contants"
import { NavLink, Link } from "react-router-dom"
import clsx from "clsx"
import { AiOutlineCaretDown, AiOutlineCaretRight, TbArrowForwardUp } from "asset/icons"
import { useSelector } from "react-redux"


const activedStyle =
  "px-4 py-2 flex items-center gap-2  bg-blue-500 text-gray-100"
const notActivedStyle = "px-4 py-2 flex items-center gap-2  hover:bg-blue-100"

const MemberSidebar = () => {
  const [actived, setActived] = useState([])
  const { current } = useSelector((state) => state.user)
  const handleShowTabs = (tabID) => {
    if (actived.some((el) => el === tabID))
      setActived((prev) => prev.filter((el) => el !== tabID))
    else setActived((prev) => [...prev, tabID])
  }
  return (
    <div>MemberSidebar</div>
  )
}

export default MemberSidebar