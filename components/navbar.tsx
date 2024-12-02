
import React from "react";
import Image from "next/image";
import pusdbtc from "../app/assets/images/PUSDBTC.svg";
import pallad from "../app/assets/images/Group 573.png";
import smallImage from "../app/assets/images/Group 570.png";
import Link from "next/link";
import { CustomConnectButton } from "./connectBtn";
function NavBar() {
  return (
    <div
      className="flex border-2 border-gray-100 h-20  border-opacity-10 items-center justify-between gap-x-4 border-l px-4 lg:px-10 py-4 z-50 "
      style={{ backgroundColor: "#272315" }}
    >
      <div className="flex items-center gap-x-4">
        <div className="w-full md:hidden rounded-xl">
          <Image src={smallImage} alt="Small Screen Image" />
        </div>
        <div className="hidden md:block rounded-xl">
          <Image src={pallad} alt="Large Screen Image" width={150} />
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <CustomConnectButton className={""} />
      </div>
    </div>
  );
}

export default NavBar;
