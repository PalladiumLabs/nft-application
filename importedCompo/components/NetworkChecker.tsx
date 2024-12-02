/* eslint-disable */
"use client"

import { useEffect } from "react"
import Web3 from "web3"

const TARGET_NETWORK_ID = 3636
const TARGET_CHAIN_NAME = "Botanix Testnet"
const BOTANIX_RPC_URL = "https://node.botanixlabs.dev"
const EXPLORER_URL = "https://explorer.botanixlabs.dev"

export const switchNetwork = async () => {
  try {
    if (typeof window !== "undefined" && window.ethereum) {
      const web3Instance = new Web3(window.ethereum)
      const currentChainId = await web3Instance.eth.getChainId()

      if (currentChainId !== BigInt(TARGET_NETWORK_ID)) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${TARGET_NETWORK_ID.toString(16)}` }]
          })
        } catch (error: any) {
          if (error.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${TARGET_NETWORK_ID.toString(16)}`,
                  chainName: TARGET_CHAIN_NAME,
                  nativeCurrency: {
                    name: "Botanix TestNet",
                    symbol: "BTC",
                    decimals: 18
                  },
                  rpcUrls: [BOTANIX_RPC_URL],
                  blockExplorerUrls: [EXPLORER_URL]
                }
              ]
            })
          } else {
            console.error("Error switching network:", error)
          }
        }
      }
    } else {
      console.error("MetaMask is not installed.")
    }
  } catch (error) {
    console.error("An error occurred while switching networks:", error)
  }
}

export const botanixChain = {
  id: 3636,
  name: "Botanix TestNet",
  nativeCurrency: {
    decimals: 18,
    name: "Botanix TestNet",
    symbol: "BTC",
  },
  rpcUrls: {
    default: {
      http: [BOTANIX_RPC_URL]
    },
    public: {
      http: [BOTANIX_RPC_URL]
    },
  },
  blockExplorers: {
    default: {
      url: EXPLORER_URL,
      name: "Botanix TestNet Explorer"
    }
  }
}

export const useEthereumChainId = (setChainId: any) => {
useEffect(() => {
  const fetchChainId = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
        const chainIdDecimal = parseInt(chainIdHex, 16)
        setChainId(chainIdDecimal)
      } catch (error) {
        console.error('Error fetching chain ID:', error)
      }
    }
  }

  const handleChainChanged = (newChainId: string) => {
    const newChainIdDecimal = parseInt(newChainId, 16)
    setChainId(newChainIdDecimal)
  }

  fetchChainId()

  if (typeof window !== "undefined" && window.ethereum) {
    window.ethereum.on('chainChanged', handleChainChanged)
  }

  return () => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }
}, [setChainId])
}
