"use client";

import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import { Label } from "@radix-ui/react-label";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import web3 from "web3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import port1 from "../assets/images/port1.svg";
import img1 from "../assets/images/Group 771.png";
import port2 from "../assets/images/Group 784.svg";
import img2 from "../assets/images/Group 784.png";

const Portfolio = () => {
  const [userInputs, setUserInputs] = useState({
    depositCollateral: "0",
    borrow: "0",
  });
  const { data: walletClient } = useWalletClient();
  //   const { isConnected } = useAccount();
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

  const troveManagerContract = getContract(
    botanixTestnet.addresses.troveManager,
    troveManagerAbi,
    provider
  );

  const sortedTrovesContract = getContract(
    botanixTestnet.addresses.sortedTroves,
    sortedTroveAbi,
    provider
  );

  const hintHelpersContract = getContract(
    botanixTestnet.addresses.hintHelpers,
    hintHelpersAbi,
    provider
  );

  const borrowerOperationsContract = getContract(
    botanixTestnet.addresses.borrowerOperations,
    borrowerOperationAbi,
    walletClient // We are using walletClient because we need to update/modify data in blockchain.
  );

  const priceFeedContract = getContract(
    botanixTestnet.addresses.priceFeed,
    priceFeedAbi,
    provider
  );

  const [troveStatus, setTroveStatus] = useState("");

  //   const availableToBorrow = price / divideBy - Number(entireDebtAndColl.debt);
  const getTroveStatus = async () => {
    console.log("nitu1", walletClient?.account.address);
    if (!walletClient) return null;
    const troveStatusBigInt = await troveManagerContract.getTroveStatus(
      walletClient?.account.address
    );
    const troveStatus =
      troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
    setTroveStatus(troveStatus);
    console.log("nitu2");
    console.log("nitu3", { troveStatusBigInt, troveStatus });
  };

  getTroveStatus();

  console.log({ troveStatus });
  return (
    <div>
      {troveStatus === "INACTIVE" && (
        // <div>
        //    <div className="w-[70rem] h-[15rem] flex flex-row  mx-16 gap-10">
        //     <div>
        //       <p className="text-white text-base mt-8 mb-4">
        //        Your Portfolio
        //       </p>

        //         <span className="text-white text-3xl">
        //           {availableToBorrow} PUSD
        //         </span>
        //       </div>
        //       <div className="flex flex-row justify-between mt-5 gap-4">
        //         <div
        //           className="flex flex-col text-white w-44 h-28 p-5"
        //           style={{ backgroundColor: "#343127" }}
        //         >
        //           <span>Collateral</span>
        //           <span>{entireDebtAndColl.coll} PUSD</span>
        //           <span>${price}</span>
        //         </div>
        //         <div
        //           className="flex flex-col text-white  w-44 h-28 p-5"
        //           style={{ backgroundColor: "#343127" }}
        //         >
        //           <span>Debt</span>
        //           <span>{entireDebtAndColl.debt} PUSD</span>
        //         </div>{" "}
        //       </div>
        //     </div>
        //     <div
        //       className="w-[12rem] h-[12rem] mt-16"
        //       style={{ backgroundColor: "#343127" }}
        //     >
        //       <div className="flex flex-col gap-8 text-white px-8 py-4">
        //         <div className="flex flex-col">
        //           <span>System LTV</span>
        //           <span>{systemLTV}%</span>
        //         </div>
        //         <div className="flex flex-col ">
        //           <span>Trove Status</span>
        //           <div className="border border-lime-500 text-lime-500 justify-center items-center text-center mt-2">
        //             {troveStatus}{" "}
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //     <div
        //       className="w-[21.5rem] h-[12rem] mt-16 px-8 py-4"
        //       style={{ backgroundColor: "#343127" }}
        //     >
        //       <div className="flex gap-16 text-white">
        //         <div className="flex flex-col gap-2">
        //           <div className="flex flex-col">
        //             <span className="text-xs">Liquidation</span>
        //             <span>${liquidation} USD</span>
        //             <span>${fetchedPrice}</span>
        //           </div>

        //           <div className="flex flex-col">
        //             <span className="text-xs">Debt Ahead</span>
        //             <span>{entireDebtAndColl.pendingETHReward} PUSD</span>
        //           </div>
        //         </div>

        //         <div className="flex flex-col">
        //           <span className="text-xs ml-2">loan to Value</span>
        //           <Knob
        //             value={value}
        //             onChange={(e) => setValue(e.value)}
        //             size={100}
        //             // showValue={false}
        //             rangeColor="#78887f"
        //             valueColor="#3dde84"
        //             strokeWidth={10}
        //           />
        //           <span className="text-xs ml-2">{value}%</span>
        //           <span className="text-xs ml-2">/100%</span>
        //           <span className="text-xs ml-2">YOUR LTV</span>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        <h1>hi</h1>
      )}
      {troveStatus === "ACTIVE" && (
        <div className="mt-10 flex flex-row justify-between gap-10">
          <div
            className="w-[35rem] h-[23.6rem] ml-[2.5rem] rounded-sm"
            style={{ backgroundColor: "#3f3b2d" }}
          >
            <div
              className="  flex flex-row justify-between p-5"
              style={{ backgroundColor: "#3d3f37" }}
            >
              <span className="text-white">TROVE</span>

              <button
                style={{ backgroundColor: "#f5d64e" }}
                className="h-10 px-8 bg-yellow-300 text-black font-bold"
              >
                <Link href="/Borrow">OPEN TROVE</Link>
              </button>
            </div>
            <div className="grid place-items-center">
              <Image src={img1} alt="home" width={200} />
              <p className="text-white text-center font-semibold text-lg mt-4">
                You don't have an Active Trove
              </p>
            </div>
          </div>
          <div
            className="w-[22rem] h-[23.6rem] ml-[2.5rem] rounded-sm"
            style={{ backgroundColor: "#3f3b2d" }}
          >
            <div
              className="  flex flex-row justify-between p-5"
              style={{ backgroundColor: "#3d3f37" }}
            >
              <span className="text-white">STABILITY POOL</span>

              <button
                style={{ backgroundColor: "#f5d64e" }}
                className="h-10 px-6 bg-yellow-300 text-black font-bold"
              >
                <Link href="/Stake">STAKE PUSD</Link>
              </button>
            </div>
            <div className="grid place-items-center">
              <Image src={port2} alt="home" width={200} />
              <p className="text-white text-center font-semibold text-lg mt-4">
                You have not Staked
              </p>
            </div>
          </div>
        </div>
      )}
      {!troveStatus && (
        <div className="mt-10 flex flex-row justify-between gap-10">
          <div
            className="w-[35rem] h-[23.6rem] ml-[2.5rem] rounded-sm"
            style={{ backgroundColor: "#3f3b2d" }}
          >
            <div
              className="  flex flex-row justify-between p-5"
              style={{ backgroundColor: "#3d3f37" }}
            >
              <span className="text-white">TROVE</span>

              <button
                style={{ backgroundColor: "#f5d64e" }}
                className="h-10 px-8 bg-yellow-300 text-black font-bold"
              >
                Connect Wallet
                {/* <Link href="/Borrow">OPEN TROVE</Link> */}
              </button>
            </div>
            <div className="grid place-items-center">
              <Image src={img1} alt="home" width={200} />
              <p className="text-white text-center font-semibold text-lg mt-4">
                You don't have an Active Trove
              </p>
            </div>
          </div>
          <div
            className="w-[22rem] h-[23.6rem] ml-[2.5rem] rounded-sm"
            style={{ backgroundColor: "#3f3b2d" }}
          >
            <div
              className="  flex flex-row justify-between p-5"
              style={{ backgroundColor: "#3d3f37" }}
            >
              <span className="text-white">STABILITY POOL</span>

              <button
                style={{ backgroundColor: "#f5d64e" }}
                className="h-10 px-4 bg-yellow-300 text-black font-bold"
              >
                {/* <Link href="/Stake">STAKE PUSD</Link> */}
                Connect Wallet
              </button>
            </div>
            <div className="grid place-items-center">
              <Image src={port2} alt="home" width={200} />
              <p className="text-white text-center font-semibold text-lg mt-4">
                You have not Staked
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
