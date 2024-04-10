"use client";
import React from "react";
import { TabsDemo } from "@/components/sidebar";
import { CardDemo } from "@/components/cards";
import NavBar from "@/components/navbar";
import { CenterBar } from "@/components/centerBar";
import Redeem from "../Redeem/index"

export default function Home() {
  return (
    <div className="grid h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>

        <div className="h-full" style={{ backgroundColor: '#272315' }}>
          <div className="text-center">
            <h1 className="text-4xl font-semibold font-sans text-yellow-300">Exchange 1 PUSD For $1 Worth Of BTC</h1>
          </div>
          <div className="flex gap-x-10">
            <Redeem />
            <div>
              <h1 className="text-3xl font-semibold font-sans text-yellow-300">About Redemptions</h1>
              <h3>Redemptions are one of Palladium’s most unique and important protocol features.
                The redemption mechanism gives PUSD holders the ability to redeem the underlying BTC collateral at face value at any time.

                Redemptions pay off debt of lowest collateral vaults, in return for their collateral.

                IMPORTANT: Redemptions are not the same as paying back your debt. To repay your loan, adjust your Trove on the Repay tab of the Borrow PUSD page</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}