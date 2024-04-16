"use client";
import React from "react";
import { TabsDemo } from "@/components/sidebar";
import { CardDemo } from "@/components/cards";
import NavBar from "@/components/navbar";
import { CenterBar } from "@/components/centerBar";
import Redeem from "../Redeem/index";

export default function Home() {
  return (
    <div className="">
      {/* <TabsDemo /> */}
      <div className="body text-black  overflow-y-scroll ">
        <div className="sticky z-50 mainT top-0  overflow-auto">
          <NavBar />
        </div>

        <div className="h-full" style={{ backgroundColor: "#272315" }}>
          <div className="flex mt-40 gap-x-10"></div>
        </div>
      </div>
    </div>
  );
}
