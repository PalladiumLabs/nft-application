"use client";
import React from "react";
import { TabsDemo } from "@/components/sidebar";
import { CardDemo } from "@/components/cards";

import NavBar from "@/components/navbar";
import { CenterBar } from "@/components/centerBar";
import Borrow from "../Borrow/index";

export default function Home() {
  return (
    <div className="grid h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
      <TabsDemo />
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>

        <div className="" style={{ backgroundColor: "#272315" }}>
          {/* <div className="text-center">
            <h1 className="text-4xl pt-20 font-semibold font-sans text-yellow-300">
              Exchange 1 PUSD For $1 Worth Of BTC
            </h1>
          </div> */}
          <div className="flex ">
            <Borrow />
          </div>
        </div>
      </div>
    </div>
  );
}
