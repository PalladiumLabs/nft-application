"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ethers } from "ethers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { toast, ToastContainer } from "react-toastify";

import nftAbi from "../src/constants/abi/NftAbi.json";
import { getContract } from "../src/utils/getContract";
import { CustomConnectButton } from "@/components/connectBtn";

import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import "./Modal.css";

import img from "../assets/images/Group 926.png";
import img1 from "../assets/images/Group 906.png";
import gif from "../assets/images/NFT.gif";
import twitter1 from "../assets/images/image 52 (Traced).svg";

export default function RedeemSepolia() {
  const { address, isConnected } = useAccount();
  const [mint, setMint] = useState("0");
  const [justMinted, setJustMinted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [twitterShare, setTwitterShare] = useState(false);
  const [discordShare, setDiscordShare] = useState(false);
  const router = useRouter();

  const provider = new ethers.JsonRpcProvider("https://node.botanixlabs.dev/");

  const nftContract = getContract(
    "0xbcDd44686125Cf838Bb077F119D7acbADd00E569",
    nftAbi,
    provider
  );

  // ✅ Retry logic for delayed blockchain indexing
  const mintStatus = async (retries = 5, delay = 1500) => {
    if (!address) {
      setMint("0");
      return;
    }

    for (let i = 0; i < retries; i++) {
      try {
        const minted = await nftContract.idOf(address);
        const tokenId = minted.toString();
        console.log(`[MintStatus] Attempt ${i + 1}: tokenId = ${tokenId}`);

        if (tokenId !== "0") {
          setMint(tokenId);
          return;
        }
      } catch (error) {
        console.error("Error checking mint status:", error);
      }

      await new Promise((res) => setTimeout(res, delay));
    }

    setMint("0");
  };

  const { data: hash, isPending, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isFailed,
  } = useWaitForTransactionReceipt({ hash });

  const handleTwitterClick = () => {
    setTwitterShare(true);
  };

  const handleDiscordClick = () => {
    setDiscordShare(true);
  };

  const handleMint = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await writeContract({
        abi: nftAbi,
        address: "0xbcDd44686125Cf838Bb077F119D7acbADd00E569",
        functionName: "safeMint",
        args: [address],
      });
    } catch (error) {
      console.error("Minting error:", error);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      setTwitterShare(false);
      setDiscordShare(false);
      setJustMinted(false);
      mintStatus();
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        mintStatus();
        setJustMinted(true);
        setIsModalVisible(false);
      }, 3000); // Let chain sync
    } else if (isFailed) {
      setIsModalVisible(false);
    }
  }, [isConfirmed, isFailed]);

  useEffect(() => {
    if (isConfirming) {
      setIsModalVisible(true);
    }
  }, [isConfirming]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center max-sm:px-5 ">
      <div className="md:mr-8 md:mt-[4rem]">
        {mint === "0" && !justMinted ? (
          <Image src={img} width={600} height={450} alt="home" />
        ) : (
          <div className="h-96 w-96  lg:mr-10 lg:ml-56">
            <Image src={gif} alt="home" />
            <p className="text-lightyellow title-text text-2xl font-extrabold text-center mt-2">
              Token ID: {mint}
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
        <div className="text-lightyellow uppercase text-3xl md:text-6xl font-bold title-text mt-4 md:mt-[2rem]">
          ascension NFT
        </div>

        <div className="mt-4">
        <div className="mt-4">
  {/*<span className="text-white text-lg mt-4 body-text">
    Minting is now closed
  </span>*/}
  <span className="text-white text-lg mt-4 body-text">
            Follow us on{" "}
            <a
              className="twitter-follow-button"
              href="https://twitter.com/PalladiumLabs"
              target="_blank"
            >
              <b>X (Twitter)</b>
            </a>{" "}
            and Join our{" "}
            <a href="https://discord.com/invite/9MMEyJ4JDz" target="_blank">
              <b>Discord Community<br/></b>
            </a>{" "}
            to mint this.
          </span>
</div>
        </div>

        {isConnected && (
          <div className="flex gap-x-2 lg:gap-x-4">
            <a
              className={`twitter-follow-button w-full md:w-[15rem] bg-lightyellow text-black text-lg font-bold title-text mt-4 px-4 py-2 flex items-center justify-center border border-lightyellow ${
                twitterShare ? "opacity-50" : ""
              }`}
              href="https://twitter.com/PalladiumLabs"
              target="_blank"
              onClick={handleTwitterClick}
              style={{ pointerEvents: twitterShare ? "none" : "auto" }}
            >
              {twitterShare ? "Followed on X" : "Follow on X"}
            </a>

            <a
              className={`w-full md:w-[15rem] bg-lightyellow text-black text-lg font-bold title-text mt-4 px-4 py-2 flex items-center justify-center border border-lightyellow ${
                discordShare ? "opacity-50" : ""
              }`}
              href="https://discord.com/invite/9MMEyJ4JDz"
              target="_blank"
              onClick={handleDiscordClick}
              style={{ pointerEvents: discordShare ? "none" : "auto" }}
            >
              {discordShare ? "Joined Discord" : "Join Discord"}
            </a>
          </div>
        )}

        <div className="flex gap-x-2 lg:gap-x-4">
          {isConnected ? (
            mint === "0" && !justMinted ? (
              twitterShare && discordShare ? (
                <button
                  className={`w-full md:w-[15rem] bg-lightyellow text-black text-lg font-bold title-text mt-4 px-4 py-2 ${
                    isPending ? "opacity-50" : ""
                  }`}
                  disabled={isPending}
                  onClick={handleMint}
                >
                  {isPending ? "Minting..." : "MINT NOW"}
                </button>
              ) : (
                <button
                  className="w-full md:w-[15rem] bg-lightyellow text-black text-lg font-bold title-text mt-4 px-4 py-2 opacity-50 cursor-not-allowed"
                 
                   title="Follow on X and Join Discord to enable mint."
                >
                  MINT NOW
                </button>
              )
            ) : (
              <button className="w-full md:w-[15rem] bg-lightyellow text-black text-lg font-bold title-text mt-4 px-4 py-2">
                ALREADY MINTED
              </button>
            )
          ) : (
            <div className="mt-4">
              <CustomConnectButton />
            </div>
          )}

          {isConnected && (
            <a
              className="twitter-share-button w-full md:w-[15rem] text-lightyellow text-lg font-medium mt-4 px-4 py-2 flex items-center justify-center border border-lightyellow"
              href="https://twitter.com/intent/tweet?text=Don't%20miss%20out%20on%20%40PalladiumLabs%20Circuit%20Breaker%20IGNITION%20NFT%20MINT!"
              target="_blank"
            >
              <span className="flex gap-x-2 items-center">
                SHARE ON
                <Image src={twitter1} width={16} height={17} alt="twitter" />
              </span>
            </a>
          )}
        </div>
      </div>
<Dialog
  visible={isModalVisible}
  onHide={() => setIsModalVisible(false)}
  closable={false}
  showHeader={false}
  className="custom-dialog"
>
  {isConfirming && (
    <div className="waiting-container">
      <div className="waiting-message">Minting NFT ✨</div>
      <Image src={gif} className="waiting-image" alt="gif" />
    </div>
  )}

  {/*isConfirmed && (
    <div className="confirmation-container">
      <div className="confirmation-message">Transaction confirmed.</div>
    </div>
  )*/}

  {isFailed &&
    toast.error("Transaction failed. Please try again.", {
      position: "top-center",
    })}
</Dialog>



      <ToastContainer />
    </div>
  );
}
