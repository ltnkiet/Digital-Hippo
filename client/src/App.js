import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Login, Public, Register } from "././page/public";
import path from "./utils/path";
import { getCategory } from "./store/asyncAction";
import { useDispatch } from "react-redux";

function App() {

  const dispatch = useDispatch() 
  useEffect(() => {
    dispatch(getCategory())  // eslint-disable-next-line
  }, [])

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.REGISTER} element={<Register />} />
        </Route>
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
