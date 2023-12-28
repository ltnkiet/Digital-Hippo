import React, { memo } from "react";

const Footer = () => {
  return (
    <footer className="w-full h-[250px] bg-[#191919] text-[#b7b7b7] text-sm flex flex-col items-center justify-center">
      <div className="w-main flex items-center">
        <div className="flex flex-2 flex-col gap-4">
          <h3 className="text-base uppercase border-l-8 font-medium border-main pl-4 text-white">
            Thông tin liên hệ
          </h3>
          <span>
            <span className="text-white">Địa chỉ:</span>
            <span className="opacity-70 ml-2">
              449/17 Trường Chinh, Quận Tân Bình, Thành Phố Hồ Chí Minh
            </span>
          </span>
          <span>
            <span className="text-white">Di động:</span>
            <span className="opacity-70 ml-2">0384029072</span>
          </span>
          <span>
            <span className="text-white">Mail:</span>
            <span className="opacity-70 ml-2">digitalhippo1@gmail.com</span>
          </span>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="text-base uppercase border-l-8 font-medium border-main pl-4 text-white">
            #DigitalHippo
          </h3>

          <span className="text-white">Help</span>

          <span className="text-white">Free Shipping</span>

          <span className="text-white">FAQS</span>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="text-base uppercase border-l-8 font-medium border-main pl-4 text-white">
            #DigitalHippo
          </h3>
          <span className="text-white">Help</span>
          <span className="text-white">Free Shipping</span>
          <span className="text-white">FAQS</span>
        </div>
      </div>
      <div className="w-main pt-10">
        <div className="grid grid-cols-2">
          <div>
            <p>© 2024, Digital Hippo Powered by ltnkiet</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default memo(Footer);
