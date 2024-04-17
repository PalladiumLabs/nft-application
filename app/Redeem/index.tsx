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
import { useRouter } from "next/navigation";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

export default function Redeem() {
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const [mint, setMint] = useState("0");
  const [newMint, setNewMint] = useState();

  const router = useRouter();

  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

  const nftContract = getContract(
    "0xD8C448dD8A4785835da7af461ebB015dD83d4a12",
    nftAbi,
    provider
  );
  const mintStatus = async () => {
    if (!address) {
      setMint("0"); // Set mint status to "0" if address is not available
      return;
    }
    const minted = await nftContract?.idOf(address);

    setMint(minted.toString());
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

      router.refresh();
      console.log("refreshed");
    } catch (error) {
      console.error("An error occurred", error);
    }
  };
  useEffect(() => {
    mintStatus();
  }, [address, mint]);

  // mint the useEffect mai
  const apiResponse = mint.toString();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center max-sm:px-5">
      <div className="md:mr-8 md:mt-[4rem]">
        {mint.toString() === "0" ? (
          <Image src={img} width={600} height={450} alt="home" />
        ) : (
          <div className=" h-[30rem] ">
            <Image src={gif} alt="home" />
            <p className="text-amber-400 font-mono text-2xl font-extrabold text-center mt-2">
              Token ID:{apiResponse}
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 md:mt-[4rem]">
        <Image
          src={img1}
          width={600}
          height={33}
          alt="home"
          className="overflow-hidden"
        />
        <div className="text-amber-400 text-2xl md:text-6xl font-bold font-mono mt-4 md:mt-[2rem]">
          GENESIS NFT
        </div>
        <div className="mt-4 ">
          <span className="text-white text-lg mt-4 font-sans">
            Collect the very first Circuit Breaker NFT and join the elite OGs of
            Palladium
          </span>
        </div>
        <div className="text-amber-400 text-xl lg:text-3xl font-bold font-mono mt-[2rem] md:mt-[4rem]">
          MINTING IS NOW AVAILABLE
        </div>
        {isConnected ? (
          mint.toString() === "0" ? (
            <button
              className={`w-full md:w-[15rem] bg-amber-400 text-black text-lg font-bold font-mono mt-4 md:mt-[2rem] px-4 py-2 ${
                isPending ? "opacity-50" : ""
              }`}
              disabled={isPending}
              onClick={handleMint}
              style={{ transition: "background-color 0.3s ease-in-out" }}
            >
              {isPending ? "Minting..." : "MINT NOW"}
            </button>
          ) : (
            <button className="w-full md:w-[15rem] bg-amber-400 text-black text-lg font-bold font-mono mt-4 md:mt-[2rem] px-4 py-2">
              ALREADY MINTED
            </button>
          )
        ) : (
          <div className="mt-4 md:mt-[2rem]">
            <CustomConnectButton />
            {/* <ConnectButton /> */}
          </div>
        )}
      </div>
    </div>
  );
}
