"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import nftAbi from "../src/constants/abi/NftAbi.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import erc20Abi from "../src/constants/abi/ERC20.sol.json";
import { getContract } from "../src/utils/getContract";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { useEffect, useState } from "react";
// import { useWalletClient, useAccount } from "wagmi";
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
import { CustomConnectButton } from "@/components/connectBtn";

export default function Redeem() {
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const [mint, setMint] = useState("0");
  const [newMint, setNewMint] = useState();

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

  return (
    <div className="flex flex-row justify-center">
      <div className="mt-[4rem] mx-[4rem]">
        <Image src={img} width={600} height={450} alt="home" />
      </div>
      <div className="mt-[4rem] ">
        <Image src={img1} width={600} height={33} alt="home" />
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
            <button className="w-[15rem] bg-amber-400 text-black text-lg font-bold font-mono mt-[2rem] px-4 py-2 ">
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
    </div>
  );
}
