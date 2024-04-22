"use client";
import React from "react";

import NavBar from "@/components/navbar";

import Redeem from "./Redeem";
import bgimg from "./assets/images/Background.png";

export default function Home() {
  return (
    // <div className="grid h-screen mainT w-full grid-cols-[max-content_1fr] overflow text-white">
    //   {/* <TabsDemo /> */}
    //   <div className="body text-black  overflow-y-scroll ">
    //     <div className="sticky z-50 mainT top-0  overflow-auto">
    //       <NavBar />
    //     </div>
    //     <div className="flex mt-2 flex-col mainT overflow-x-auto">
    //       <div className="grid  grid-cols-[1fr_max-content] gap-x-5">
    //         <div className="flex flex-col gap-y">
    //           <CardDemo />
    //           <div className="ml-7">
    //             <CenterBar />
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //   </div>
    // </div>
    <div
      className="h-fit pb-48 bg-[url('./assets/images/Background.png')] bg-cover"
      style={{ backgroundColor: "#272315" }}
    >
      <NavBar />
      <Redeem />
    </div>
  );
}
