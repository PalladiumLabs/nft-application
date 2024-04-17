"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import nftAbi from "../src/constants/abi/NftAbi.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import erc20Abi from "../src/constants/abi/ERC20.sol.json";
import { getContract } from "../src/utils/getContract";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  useAccount,
  useTransactionReceipt,
  useWaitForTransactionReceipt,
  useWriteContract,
  useWalletClient,
} from "wagmi";
import web3 from "web3";
import "../App.css";
import Image from "next/image";
import img from "../assets/images/Group 926.png";
import img1 from "../assets/images/Group 906.png";
import gif from "../assets/images/NFT.gif";
import { CustomConnectButton } from "@/components/connectBtn";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Redeem() {
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const [mint, setMint] = useState("0");
  const [newMint, setNewMint] = useState();
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // const handleResize = () => {
  //   setWindowWidth(window.innerWidth);
  // };
  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  const lgBreakpoint = 1024;

  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);
  console.log("address", address);
  const nftContract = getContract(
    "0xD8C448dD8A4785835da7af461ebB015dD83d4a12",
    nftAbi,
    provider
  );
  const mintStatus = async () => {
    console.log(
      walletClient?.account?.address,
      "walletClient?.account?.address"
    );
    const minted = await nftContract?.idOf(address);
    console.log(mint, "mint1");
    setMint(minted.toString());
    console.log(mint, "mint2");
  };

  const { data, writeContract, isPending } = useWriteContract();

  const handleMint = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      writeContract({
        abi: nftAbi,
        address: "0xD8C448dD8A4785835da7af461ebB015dD83d4a12",
        functionName: "safeMint",
        args: [address],
      });
    } catch (error) {
      console.error("An error occurred", error);
    }
  };
  useEffect(() => {
    mintStatus();
  }, [address, mint]);
  // mint the useEffect mai
  const handleAlreadyMinted = () => {
    // For demonstration purposes, showing a static message and a GIF
    console.log("You have already minted this NFT.");
    const apiResponse = mint.toString();
    const gifUrl = "../assets/images/NFT.gif";

    toast(
      <div
        className="w-[500] h-[500]  flex flex-row justify-center p-2"
        style={{ backgroundColor: "#272315" }}
      >
        <p className="text-amber-400  font-mono font-2xl ">
          Token ID:{apiResponse}
        </p>
        <Image src={gif} width={100} height={150} alt="home" />
      </div>,
      {
        autoClose: false, // Keep the notification open until manually closed
      }
    );
  };
  return (
    <div className="flex flex-row justify-center">
      {/* {windowWidth >= lgBreakpoint ? ( // Check if screen size is larger than or equal to lg breakpoint
        <> */}
      <div className="mt-[4rem] mx-[4rem]">
        <Image src={img} width={600} height={450} alt="home" />
      </div>
      <div className="mt-[4rem] ">
        <Image
          src={img1}
          width={600}
          height={33}
          alt="home"
          className="overflow-hidden"
        />
        <div className="text-amber-400 text-6xl font-bold font-mono mt-[2rem]">
          GENESIS NFT
        </div>
        <p className="text-white text-lg mt-[2rem] font-sans">
          Collect the very first Circuit Breaker NFT and join the <br /> elite
          OGs of Palladium
        </p>
        <div className="text-amber-400 text-3xl font-bold font-mono mt-[4rem]">
          MINTING IS NOW AVAILABLE
        </div>

        {isConnected ? (
          mint.toString() === "0" ? (
            <button
              className="w-[15rem] bg-amber-400 text-black text-lg font-bold font-mono mt-[2rem] px-4 py-2 "
              disabled={isPending}
              onClick={handleMint}
            >
              {isPending ? "Minting" : "MINT NOW"}
            </button>
          ) : (
            <button
              className="w-[15rem] bg-amber-400 text-black text-lg font-bold font-mono mt-[2rem] px-4 py-2 "
              onClick={handleAlreadyMinted}
            >
              ALREADY MINTED
            </button>
          )
        ) : (
          <div className="mt-[2rem]">
            <CustomConnectButton />
            {/* <ConnectButton /> */}
          </div>
        )}
      </div>
      {/* </>
      ) : (
        <div className="text-white text-lg font-sans mt-[2rem]">
          Open this page in desktop to view the content.
        </div> */}
      {/* )} */}
      <ToastContainer />
    </div>
  );
}
