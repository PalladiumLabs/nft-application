import { NextRequest } from "next/server";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import rawTreeData from "../../src/tree.json";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address")?.toLowerCase();

    if (!address) {
      return new Response(JSON.stringify({ error: "Missing address" }), { status: 400 });
    }

    const tree = StandardMerkleTree.load(rawTreeData as any);

    let index = -1;
    for (const [i, v] of tree.entries()) {
      if (v[0].toLowerCase() === address) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      return new Response(JSON.stringify({ proof: [], found: false }), { status: 200 });
    }

    const proof = tree.getProof(index);

    return new Response(JSON.stringify({ proof, found: true }), { status: 200 });
  } catch (err) {
    console.error("Merkle proof generation error:", err);
    return new Response(JSON.stringify({ error: "Server error", message: (err as Error).message }), {
      status: 500,
    });
  }
}
