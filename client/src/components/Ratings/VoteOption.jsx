import React, { memo, useRef, useEffect, useState } from "react";
import { voteOptions } from "utils/contant";
import { FaStar } from "asset/icons";
import { ButtonV2 } from "components";

const VoteOption = ({ nameProduct, handleSubmitVoteOption }) => {
  const modalRef = useRef();
  const [chosenScore, setChosenScore] = useState(null);
  const [comment, setComment] = useState("");
  const [score, setScore] = useState(null);

  useEffect(() => {
    modalRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={modalRef}
      className="bg-white w-[700px] p-5 flex-col gap-4 flex items-center justify-center rounded-lg">
      <h2 className="text-center text-medium text-lg">
        Đánh giá sản phẩm
        <span className="text-main ml-2">{nameProduct}</span>
      </h2>
      <textarea
        className="form-textarea w-full placeholder:italic placeholder:text-xs placeholder:text-gray-500 text-sm"
        placeholder="Nhận xét của bạn"
        value={comment}
        onChange={(e) => setComment(e.target.value)}></textarea>
      <div className="w-full flex flex-col gap-4">
        <p>Bạn cảm thấy sản phẩm này như thế nào?</p>
        <div className="flex justify-center gap-4 items-center">
          {voteOptions.map((el) => (
            <div
              className="w-[100px] bg-gray-200 cursor-pointer rounded-md p-4 h-[100px] flex items-center justify-center flex-col gap-2"
              key={el.id}
              onClick={() => {
                setChosenScore(el.id);
                setScore(el.id);
              }}>
              {Number(chosenScore) && chosenScore >= el.id ? (
                <FaStar className="text-amber-400"/>
              ) : (
                <FaStar color="gray" />
              )}
              <span>{el.text}</span>
            </div>
          ))}
        </div>
      </div>
      <ButtonV2
        handleOnClick={() => handleSubmitVoteOption({ comment, score })}
        fw>
        Gửi
      </ButtonV2>
    </div>
  );
};

export default memo(VoteOption);
