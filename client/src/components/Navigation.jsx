import React from "react";

import { navigation } from "../utils/contant";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="w-full flex items-center justify-center bg-main">
    <div className="w-main h-10 py-5 flex items-center">
      {navigation.map((nav) => (
        <NavLink to={nav.path} key={nav.id}
          className={({isActive}) => isActive ? 'pr-12 text-white underline font-bold' : 'pr-12 text-white hover:underline font-medium'}
        >
          {nav.value}
        </NavLink>
      ))}
    </div>
    </div>
  );
};

export default Navigation;
