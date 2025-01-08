import React, { useState } from "react";

import { FaWallet } from "react-icons/fa";
import { ethers } from "ethers";
import { useAppContext } from "../../App";

export default function NavBar() {
  const [dark, setDark] = useState<boolean>(false);
  const {setWalletAdd} = useAppContext()
  const toggleDarkMode = () => {
    setDark(!dark);
  };

  const connectWallet = async () => {
    console.log("Is Working");
    if (window.ethereum) {
      try {
        // Request wallet connection
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Initialize an ethers provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(provider);
        const signer = provider.getSigner()
        const add = await signer.getAddress()
        console.log("Wallet Connected Address = ", add);
        setWalletAdd(add)
      } catch (error) {
        console.error("Connection error:", error);
      }
    } else {
      alert("Please install MetaMask to connect your wallet!");
    }
  };
  return (
    <div
      className="px-2 md:px-10 py-4"
      style={{
        backgroundColor:"#f4d8b8",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
      }}
    >
      <div className=" flex justify-between">
        <div className="  text-2xl md:text-3xl font-bold doto-logo">
        Echo Shield
        </div>
        <div className="flex justify-evenly gap-4">
          <div
            className=""
            onClick={() => {
              connectWallet();
            }}
          >
            <FaWallet className="hidden md:block" size={30} />
            <FaWallet className="block md:hidden" size={20} />
          </div>
          <div className="" onClick={toggleDarkMode}>
          </div>
        </div>
      </div>
    </div>
  );
}
