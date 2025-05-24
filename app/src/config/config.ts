import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import Botanix from "../../../public/botanixLogo.svg";

const botanixChain: Chain = {
  id: 3636,
  name: "Botanix Testnet",
  // network: "BTC",
  iconUrl: "/img/b2.png",
  nativeCurrency: {
    decimals: 18,
    name: "Botanix Testnet",
    symbol: "BTC",
  },
  rpcUrls: {
    default: {
      http: ["https://node.botanixlabs.dev"],
    },
    public: {
      http: ["https://node.botanixlabs.dev"],
    },
  },
};
{/*export const sepoliaChain: Chain = {
  id: 11155111,
  name: "Sepolia Testnet",
  iconUrl: "/img/b2.png",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia Testnet",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.infura.io/v3/ad9cef41c9c844a7b54d10be24d416e5"],
    },
    public: {
      http: ["https://sepolia.infura.io/v3/ad9cef41c9c844a7b54d10be24d416e5"],
    },
  },
};*/}
export const wagmiConfig = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "ee56c353983496c87480ff2ae841a933",
  chains: [botanixChain],
  // transports: {
  // 	[mainnet.id]: http(),
  // },
});
