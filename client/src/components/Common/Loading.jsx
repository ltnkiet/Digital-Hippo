import React, { memo } from "react";
import { HashLoader } from "react-spinners";

const Loading = () => {
  return <HashLoader color="#349fe2" />;
};

export default memo(Loading);
