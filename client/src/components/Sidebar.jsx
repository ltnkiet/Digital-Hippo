import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { createSlug } from "../utils/helpers";

const Sidebar = () => {

  const { categories } = useSelector((state) => state.app);

  return (
    <div className="flex flex-col justify-center border gap-2">
      {categories?.map((el) => (
        <NavLink
          key={el._id}
          to={createSlug(el.name)}
          className={({ isActive }) =>
            isActive
              ? "text-main hover:text-main flex flex-row items-center gap-4"
              : "px-5 py-[15px] hover:text-main flex flex-row items-center gap-4"
          }>
          <img src={el.image[0]} alt="" className="w-12 px-2" />
          <p className="text-lg font-medium">{el.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
