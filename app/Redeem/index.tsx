"use client";
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
import { useWalletClient, useAccount } from "wagmi";

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
    const minted = await nftContract?.idOf(walletClient?.account?.address);
    console.log(mint, "mint1");
    setMint(minted.toString());
    console.log(mint, "mint2");
  };
  const handleMint = async () => {
    console.log(walletClient?.account?.address, "hello");
    try {
      const minted = await nftContract.safeMint(address);
      console.log(minted, "minted");
      //   setNewMint(minted);

      //   alert("minted");
    } catch (error) {
      console.error(error);
    }
  };
  // const handleClaimClick = async () => {
  //     const timeStamp = new Date().toISOString();
  //     const alertMessage = `${address} has connected at ${timeStamp}`;
  //     alert(alertMessage);

  //     try {
  //         // Replace 'YourContractAddress' and 'YourPrivateKey' with your actual contract address and private key
  //         const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
  //         const wallet = new Wallet(PRIVATE_KEY, provider);

  //         // Load ABI from the JSON file
  //         const abi: any[] = contractABI;

  //         //rainbowkit contract
  //         const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

  //         // Call the claim function on the smart contract
  //         const transaction = await contract.claim(address);

  //         // Wait for the transaction to be mined
  //         await transaction.wait();

  //         const transactionHash = transaction.hash;

  //         alert(`Claim successful!\nTransaction Hash: ${transactionHash}`);
  //         console.log("Claim successful!");
  //     } catch (error) {
  //         console.error(error);
  //         alert("Claim failed!, please try again");
  //     }
  // };
  useEffect(() => {
    mintStatus();
  }, [address]);
  // mint the useEffect mai

  //   const priceFeedContract = getContract(
  //     botanixTestnet.addresses.priceFeed,
  //     priceFeedAbi,
  //     provider
  //   );

  //   const erc20Contract = getContract(
  //     botanixTestnet.addresses.pusdToken,
  //     erc20Abi,
  //     provider
  //   );

  //   const hintHelpersContract = getContract(
  //     botanixTestnet.addresses.hintHelpers,
  //     hintHelpersAbi,
  //     provider
  //   );

  //   const sortedTrovesContract = getContract(
  //     botanixTestnet.addresses.sortedTroves,
  //     sortedTroveAbi,
  //     provider
  //   );

  //   const troveManagerContract = getContract(
  //     botanixTestnet.addresses.troveManager,
  //     troveManagerAbi,
  //     walletClient
  //   );

  //   const { toWei, toBigInt } = web3.utils;

  //   useEffect(() => {
  //     const fetchPrice = async () => {
  //       const price = await priceFeedContract.getPrice();
  //       console.log(price, "price");
  //       if (!walletClient) return null;
  //       const { 0: debt, 1: coll } =
  //         await troveManagerContract.getEntireDebtAndColl(
  //           walletClient.account.address
  //         );

  //       const pusdBalanceValue = await erc20Contract.balanceOf(
  //         walletClient.account.address
  //       );
  //       const pusdBalanceFormatted = ethers.formatUnits(pusdBalanceValue, 18);
  //       setPusdBalance(Number(Number(pusdBalanceFormatted).toFixed(2)));
  //       const convertedPrice = price.toString();
  //       console.log(convertedPrice, "convertedprice");
  //       setFetchedPrice(convertedPrice);
  //     };
  //     fetchPrice();
  //   }, []);

  //   const handleConfirmClick = async () => {
  //     try {
  //       setIsRedeeming(true);
  //       const pow = Decimal.pow(10, 18);

  //       const inputBeforeConv = new Decimal(userInput);

  //       const inputValue = inputBeforeConv.mul(pow).toFixed();

  //       // setUserInput(inputValue);

  //       console.log(inputValue, "inputValue");

  //       const redemptionhint = await hintHelpersContract.getRedemptionHints(
  //         inputValue,
  //         fetchedPrice,
  //         50
  //       );
  //       console.log(redemptionhint, "redemption");

  //       const {
  //         0: firstRedemptionHint,
  //         1: partialRedemptionNewICR,
  //         2: truncatedLUSDAmount,
  //       } = redemptionhint;

  //       const numTroves = await sortedTrovesContract.getSize();
  //       const numTrials = numTroves * toBigInt("15");

  //       console.log(numTrials, "numTrials");

  //       // Get the approximate partial redemption hint
  //       const { hintAddress: approxPartialRedemptionHint } =
  //         await hintHelpersContract.getApproxHint(
  //           partialRedemptionNewICR,
  //           numTrials,
  //           42
  //         );

  //       const exactPartialRedemptionHint =
  //         await sortedTrovesContract.findInsertPosition(
  //           partialRedemptionNewICR,
  //           approxPartialRedemptionHint,
  //           approxPartialRedemptionHint
  //         );
  //       console.log(exactPartialRedemptionHint, "exactPartialRedemptionHint");

  //       const maxFee = "5".concat("0".repeat(16));
  //       console.log(maxFee, "maxFee");

  //       console.log(truncatedLUSDAmount, "truncatedLUSDAmount");
  //       console.log(firstRedemptionHint, "firstRedemptionHint");
  //       console.log(exactPartialRedemptionHint[0], "exactPartialRedemptionHint");
  //       console.log(partialRedemptionNewICR, "partialRedemptionNewICR");

  //       const redeem = await troveManagerContract.redeemCollateral(
  //         truncatedLUSDAmount,
  //         firstRedemptionHint,
  //         exactPartialRedemptionHint[0], //upper hint
  //         exactPartialRedemptionHint[1], //lower hint
  //         partialRedemptionNewICR,
  //         0,
  //         maxFee
  //       );
  //       console.log(redeem, "redeem");
  //       setIsRedeeming(false);
  //     } catch (error) {
  //       console.error(error);
  //       setIsRedeeming(false);
  //     }
  //   };

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

        {walletClient?.account ? (
          mint.toString() === "0" ? (
            <button
              className="w-[15rem] bg-amber-400 text-black text-lg font-bold font-mono mt-[2rem] px-4 py-2 "
              onClick={handleMint}
            >
              MINT NOW
            </button>
          ) : (
            <button className="w-[15rem] bg-amber-400 text-black text-lg font-bold font-mono mt-[2rem] px-4 py-2 ">
              ALREADY MINTED
            </button>
          )
        ) : (
          <button className="w-[15rem] bg-amber-400 text-black text-lg font-bold font-mono mt-[2rem] px-4 py-2 ">
            CONNECT WALLET
          </button>
        )}
      </div>
    </div>
  );
}
