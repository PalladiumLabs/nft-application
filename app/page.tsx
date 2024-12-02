"use client";
import React from "react";
import NavBar from "@/components/navbar";
import RedeemSepolia from "./RedeemSepolia";

export default function Home() {
  return (
    <div
      className="h-fit pb-48 bg-[url('./assets/images/Background.png')] bg-cover"
      style={{ backgroundColor: "#272315" }}
    >
      <NavBar />
      <RedeemSepolia />
    </div>
  );
}
