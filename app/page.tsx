"use client";
import React from "react";
import NavBar from "@/components/navbar";
import RedeemSepolia from "./RedeemSepolia";

export default function Home() {
  return (
    // <div
    //   className="h-[100vh] pb-20  items-center bg-[url('./assets/images/Background.png')] bg-cover"
    //   style={{ backgroundColor: "#272315" }}
    // >
    //   <NavBar />
    //   <RedeemSepolia />
    // </div>
    <div
      className="min-h-screen w-full bg-[url('./assets/images/Background.png')] bg-cover bg-center bg-no-repeat fixed inset-0"
      style={{
        backgroundColor: "#272315",
      }}
    >
      <NavBar />
      <RedeemSepolia />
    </div>
  );
}
