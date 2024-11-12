import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

export default function NavBar() {
  const [dark, setDark] = useState<boolean>(false);
  const toggleDarkMode = () => {
    setDark(!dark);
  };
  return (
    <div
      className="px-2 md:px-10 py-4"
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
      }}
    >
      <div className=" flex justify-between">
        <div className=" text-red-600 text-xl md:text-2xl font-bold">𝖊𝖈𝖍𝖔𝖘𝖍𝖎𝖊𝖑𝖉</div>
        <div className="flex justify-evenly gap-4">
          <div className="">

  <FaQuestionCircle className="hidden md:block" size={30} />
  <FaQuestionCircle className="block md:hidden" size={20} />

          </div>
          <div className="">
            {dark ? (
              <div className="">
                <MdOutlineDarkMode className="hidden md:block" size={30} />
                <MdOutlineDarkMode className="block md:hidden" size={20} />
              </div>
            ) : (
              <div className="">
                <MdDarkMode className="hidden md:block" size={30} />
                <MdDarkMode className="block md:hidden" size={20} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
