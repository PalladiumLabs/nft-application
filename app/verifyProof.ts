import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import rawTreeData from "../tree.json";
import { ethers } from "ethers";

// Smart contract setup
const CONTRACT_ADDRESS = "0xd7456075c69df6f649B68Bdab4dE34d149d18fF6";
const ABI = [
  {
    type: "function",
    name: "verify",
    inputs: [
      { name: "proof", type: "bytes32[]", internalType: "bytes32[]" },
      { name: "addr", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
];

export const generateProofAndVerify = async (address: string) => {
  const lowercaseAddress = address.toLowerCase();

  // ✅ Let TS infer type (or use `as any` if needed)
  const tree = StandardMerkleTree.load(rawTreeData as any);

  // Find address index
  let index = -1;
  for (const [i, v] of tree.entries()) {
    if (v[0].toLowerCase() === lowercaseAddress) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    console.warn("❌ Address not found in tree");
    return { proof: [], isVerified: false };
  }

  const proof = tree.getProof(index);

  // On-chain verification
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  const isVerified = await contract.verify(proof, address);

  return { proof, isVerified };
};
