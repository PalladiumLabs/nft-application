"use client"

import nftAbi from "../src/constants/abi/NftAbi.json"
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl"
import { getContract } from "../src/utils/getContract"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import "../App.css"
import Image from "next/image"
import img from "../assets/images/Group 926.png"
import img1 from "../assets/images/Group 906.png"
import gif from "../assets/images/NFT_2.gif"
import { CustomConnectButton } from "@/components/connectBtn"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/navigation"
import "react-responsive-modal/styles.css"
import { Dialog } from "primereact/dialog"
import "./Modal.css"
import twitter1 from "../assets/images/image 52 (Traced).svg"

export default function RedeemSepolia() {
  const { address, isConnected } = useAccount()
  const [mint, setMint] = useState("0")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [twitterShare, setTwitterShare] = useState(false)
  const [discordShare, setDiscordShare] = useState(false)
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL)
  const router = useRouter()

  const nftContract = getContract(
    "0x98308Df644D91B78a797493C184dF7A731ecb530",
    nftAbi,
    provider
  )

  const mintStatus = async () => {
    if (!address) {
      setMint("0")
      return
    }
    const minted = await nftContract?.idOf(address)
    setMint(minted.toString())
  }

  const { data: hash, isPending, writeContract } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isFailed,
  } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTwitterClicked = localStorage.getItem("twitterShare")
      const storedDiscordClicked = localStorage.getItem("discordShare")
      setTwitterShare(storedTwitterClicked === "true")
      setDiscordShare(storedDiscordClicked === "true")
    }
  }, [])
  const handleTwitterClick = () => {
    setTwitterShare(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("twitterShare", "true")
    }
  }

  const handleDiscordClick = () => {
    setDiscordShare(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("discordShare", "true")
    }
  }

  const handleMint = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try {
      writeContract({
        abi: nftAbi,
        address: "0x98308Df644D91B78a797493C184dF7A731ecb530",
        functionName: "safeMint",
        args: [address],
      })

      router.refresh()
    } catch (error) {
      console.error("An error occurred", error)
    }
  }

  useEffect(() => {
    mintStatus()
  }, [address, mint, isConfirming, isConfirmed])

  useEffect(() => {
    if (isConfirmed || isFailed) {
      setIsModalVisible(false)
    }
  }, [isConfirmed, isFailed])

  useEffect(() => {
    if (isConfirming) {
      setIsModalVisible(true)
    }
  }, [isConfirming])

  const apiResponse = mint.toString()

  return (
    <div className="flex flex-col md:flex-row items-center justify-center max-sm:px-5">
      <div className="md:mr-8 md:mt-[4rem]">
        {mint.toString() === "0" ? (
          <Image src={img} width={600} height={450} alt="home" />
        ) : (
          <div className=" h-[30rem] lg:ml-56 lg:mr-10">
            <Image src={gif} alt="home" />
            <p className="text-lightyellow title-text text-2xl font-extrabold text-center mt-2">
              Token ID:<span>{""}</span> {apiResponse}
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 md:mt-[4rem]">
        <Image src={img1} width={600} height={33} alt="home" className="overflow-hidden" />
        <div className="text-lightyellow text-3xl md:text-6xl font-bold title-text mt-4 md:mt-[2rem]">
          Testnet NFT
        </div>
        <div className="mt-4 ">
          <span className="text-white text-lg mt-4 body-text">
            Follow us on{" "}
            <span>
              <a className="twitter-follow-button" href="https://twitter.com/PalladiumLabs" target="_blank">
                <b>X (Twitter)</b>
              </a>
            </span>{" "}and Join our{" "}
            <span>
              <a href="https://discord.com/invite/9MMEyJ4JDz" target="_blank">
                {" "}
                <b>Discord Community</b>
              </a>
            </span>{" "}to mint this NFT.
          </span>
        </div>
        {isConnected ? (
          <div className="flex    gap-x-2 lg:gap-x-4 ">
            {" "}
            <a className="twitter-follow-button w-full md:w-[15rem] bg-lightyellow text-black text-lg font-bold title-text mt-4 md:mt-[2rem] px-4 py-2 text-center flex flex-row border border-lightyellow items-center justify-center place-items-center gap-x-2" href="https://twitter.com/PalladiumLabs" target="_blank" onClick={handleTwitterClick}>
              <div className="flex flex-row items-center justify-center gap-x-2">
                FOLLOW ON X
              </div>
            </a>
            <a className="w-full md:w-[15rem] bg-lightyellow text-black text-lg font-bold title-text mt-4 md:mt-[2rem] px-4 py-2 text-center flex flex-row border border-lightyellow items-center justify-center place-items-center gap-x-2" href="https://discord.com/invite/9MMEyJ4JDz" target="_blank" onClick={handleDiscordClick}>
              {" "}
              <span>JOIN DISCORD</span>
            </a>
          </div>
        ) : (
          <div></div>
        )}
        <div className="flex    gap-x-2 lg:gap-x-4 ">
          {isConnected ? (
            mint.toString() === "0" ? (
              <>
                {twitterShare && discordShare ? (
                  <button className={`w-full md:w-[15rem] bg-lightyellow text-black text-lg font-bold title-text mt-4 md:mt-[2rem] px-4 py-2 ${isPending ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isPending} onClick={handleMint} style={{ transition: "background-color 0.3s ease-in-out" }}>
                    {isPending ? "Minting..." : "MINT NOW"}
                  </button>
                ) : (
                  <button className={`w-full md:w-[15rem] bg-lightyellow text-black text-lg font-bold title-text mt-4 md:mt-[2rem] px-4 py-2 opacity-50 ${!twitterShare && !discordShare && "cursor-not-allowed"}`} title="Follow on X and Join Discord to enable mint." style={{ transition: "background-color 0.3s ease-in-out" }}>
                    MINT NOW
                  </button>
                )}
              </>
            ) : (
              <button className="w-full md:w-[15rem] bg-lightyellow text-black text-lg font-bold title-text cursor-not-allowed mt-4 md:mt-[2rem] px-4 py-2">
                aLREADY MINTED
              </button>
            )
          ) : (
            <div className="mt-4 md:mt-[2rem]">
              <CustomConnectButton className={""} />
            </div>
          )}
          {isConnected  ? (
            <a className={`twitter-share-button w-full md:w-[15rem] text-lightyellow text-lg font-medium font-Montechmed mt-4 md:mt-[2rem] px-4 py-2 text-center flex flex-row border border-lightyellow items-center justify-center place-items-center gap-x-2 ${mint.toString() !== "0" ? "cursor-pointer": "cursor-not-allowed"}`} href="https://twitter.com/intent/tweet?text=Don't%20miss%20out%20on%20%40PalladiumLabs%20Circuit%20Breaker%20Testnet%20NFT%20MINT!%20%F0%9F%8E%A8%F0%9F%8E%96%0A%0AMint%20now%20on%20%40BotanixLabs%20and%20become%20one%20of%20the%20exclusive%20OGs%20of%20Palladium!%20%F0%9F%A4%AF%0A%0AMint%20yours%20before%20it's%20too%20late!%20%E2%8F%B3%F0%9F%9A%A8" target="_blank" data-size="large">
              <div className="flex flex-row items-center justify-center gap-x-2">
                
                <Image src={twitter1} width={16} height={17} alt="twitter" />
              </div>
            </a>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <Dialog visible={isModalVisible} onHide={() => setIsModalVisible(false)} closable={false}>
        {isConfirming && (
          <div className="waiting-container">
            <div className="waiting-message text-xl font-mono whitespace-nowrap">
              Minting NFT ✨
            </div>
            <Image src={gif} className="waiting-image" alt="gif" />
          </div>
        )}
        {isFailed && toast.error("Transaction failed. Please try again.")}

        {isConfirmed && (
          <div className="text-3xl text-white">Transaction confirmed.</div>
        )}
      </Dialog>
      <ToastContainer />
    </div>
  )
}
