"use client";

import borrowerOperationAbi from "../src/constants/abi/BorrowerOperations.sol.json";
import hintHelpersAbi from "../src/constants/abi/HintHelpers.sol.json";
import priceFeedAbi from "../src/constants/abi/PriceFeedTestnet.sol.json";
import sortedTroveAbi from "../src/constants/abi/SortedTroves.sol.json";
import troveManagerAbi from "../src/constants/abi/TroveManager.sol.json";
import stabilityPoolAbi from "../src/constants/abi/StabilityPool.sol.json";
import { BOTANIX_RPC_URL } from "../src/constants/botanixRpcUrl";
import botanixTestnet from "../src/constants/botanixTestnet.json";
import { getContract } from "../src/utils/getContract";
import { Label } from "@radix-ui/react-label";
import Decimal from "decimal.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import web3 from "web3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import port1 from "../assets/images/port1.svg";
import img1 from "../assets/images/Group 771.png";
import port2 from "../assets/images/Group 784.svg";
import img2 from "../assets/images/Group 784.png";
import { Knob } from "primereact/knob";
// import { ProgressBar } from "primereact/progressbar";
import Progress from "./Progress";

const Portfolio = () => {
  const [userInputs, setUserInputs] = useState({
    depositCollateral: "0",
    borrow: "0",
  });
  const [borrowingFee, setBorrowingFee] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [ltv, setLtv] = useState(0);
  const [lr, setLr] = useState(0);
  const [price, setPrice] = useState<number>(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [hasPriceFetched, setHasPriceFetched] = useState(false);
  const [hasGotStaticData, setHasGotStaticData] = useState(false);
  const [newDebt, setNewDebt] = useState(0);
  const [totalCollateral, setTotalCollateral] = useState(0);
  const [availableBorrow, setAvailableBorrow] = useState(0);

  // static
  const [staticLiquidationPrice, setStaticLiquidationPrice] = useState(0);
  const [staticLtv, setStaticLtv] = useState(0);
  const [staticTotalCollateral, setStaticTotalCollateral] = useState(0);
  const [staticTotalDebt, setStaticTotalDebt] = useState(0);
  const [staticCollAmount, setStaticCollAmount] = useState(0);
  const [staticBorrowingFee, setStaticBorrowingFee] = useState(0);
  const [value, setValue] = useState(60);
  const [userInput, setUserInput] = useState("0");

  const [systemLTV, setSystemLTV] = useState("0");
  const [entireDebtAndColl, setEntireDebtAndColl] = useState({
    debt: "0",
    coll: "0",
    pendingLUSDDebtReward: "0",
    pendingETHReward: "0",
  });
  const [fetchedPrice, setFetchedPrice] = useState("0");

  const { data: walletClient } = useWalletClient();

  const { data: balanceData } = useBalance({
    address: walletClient?.account.address,
  });
  //   const { isConnected } = useAccount();
  const provider = new ethers.JsonRpcProvider(BOTANIX_RPC_URL);

  const troveManagerContract = getContract(
    botanixTestnet.addresses.troveManager,
    troveManagerAbi,
    provider
  );

  const sortedTrovesContract = getContract(
    botanixTestnet.addresses.sortedTroves,
    sortedTroveAbi,
    provider
  );

  const hintHelpersContract = getContract(
    botanixTestnet.addresses.hintHelpers,
    hintHelpersAbi,
    provider
  );

  const borrowerOperationsContract = getContract(
    botanixTestnet.addresses.borrowerOperations,
    borrowerOperationAbi,
    walletClient // We are using walletClient because we need to update/modify data in blockchain.
  );

  const priceFeedContract = getContract(
    botanixTestnet.addresses.priceFeed,
    priceFeedAbi,
    provider
  );

  const stabilityPoolContractReadOnly = getContract(
    botanixTestnet.addresses.stabilityPool,
    stabilityPoolAbi,
    provider
  );

  const [troveStatus, setTroveStatus] = useState("");
  const [totalStakedValue, setTotalStakedValue] = useState("0");

  //ACTIVE
  const { isConnected } = useAccount();
  const { toWei, toBigInt } = web3.utils;
  const pow20 = Decimal.pow(10, 20);
  const pow18 = Decimal.pow(10, 18);
  const totalSupply = 100;
  const suppliedAmount = 40;

  useEffect(() => {
    const pow = Decimal.pow(10, 18);
    const pow16 = Decimal.pow(10, 16);
    const _1e18 = toBigInt(pow.toFixed());
    const _1e16 = toBigInt(pow16.toFixed());
    const fetchedData = async () => {
      console.log(walletClient?.account.address, "walletClient");
      if (!walletClient) return null;
      const {
        0: debt,
        1: coll,
        2: pendingLUSDDebtReward,
        3: pendingETHReward,
      } = await troveManagerContract.getEntireDebtAndColl(
        walletClient?.account.address
      );
      console.log(entireDebtAndColl.coll);

      console.log("Collateral (raw):", coll); // Log the raw collateral value
      const collDecimal = new Decimal(coll.toString()); // Convert coll to a Decimal
      const collFormatted = collDecimal.div(_1e18.toString()).toString(); // Divide coll by _1e18 and convert to string

      console.log(collFormatted, "collFormatted");
      setEntireDebtAndColl({
        debt: (debt / _1e18).toString(),
        coll: collFormatted,
        pendingLUSDDebtReward: (pendingLUSDDebtReward / _1e18).toString(),
        pendingETHReward: (pendingETHReward / _1e18).toString(),
      });

      // if (!provider || hasPriceFetched) return null;
      // const fetchPrice = await priceFeedContract.getPrice();
      // setHasPriceFetched(true);
      // setPrice(fetchPrice);
      // console.log(fetchPrice, "Fetching price");
      // Fetch data from the PriceFeedContract
      if (!hasPriceFetched) {
        try {
          const fetchPrice: bigint = await priceFeedContract.getPrice();
          console.log(fetchPrice, "Fetching price");

          const fetchPriceDecimal = new Decimal(fetchPrice.toString()); // Convert coll to a Decimal
          const fetchPriceFormatted = fetchPriceDecimal
            .div(_1e18.toString())
            .toString();
          setFetchedPrice(fetchPriceFormatted);

          // Multiply collFormatted with fetchPrice
          const updatedCollFormatted = new Decimal(collFormatted).mul(
            fetchPriceFormatted
          );
          console.log(updatedCollFormatted, "updatedCollFormatted");

          // Convert the result back to a number before setting the state
          const updatedPrice = parseFloat(updatedCollFormatted.toString());

          // Update state with the multiplied value
          setPrice(updatedPrice);
          console.log(updatedPrice, "Multiplied collFormatted");
          setHasPriceFetched(true);
        } catch (error) {
          console.error(error, "Error fetching price");
          setHasPriceFetched(true);
        }
      }
    };

    const getSystemLTV = async () => {
      const systemLTV = await troveManagerContract.getTCR(price);
      console.log(systemLTV, "systemLTV");
      const systemLTVDecimal = new Decimal(systemLTV.toString()); // Convert coll to a Decimal
      const systemLTVFormatted = systemLTVDecimal
        .div(_1e16.toString())
        .toString();
      setSystemLTV(systemLTVFormatted);
    };

    ///////////////////
    const getStakedValue = async () => {
      if (!walletClient) return null;
      const fetchedTotalStakedValue =
        await stabilityPoolContractReadOnly.getCompoundedLUSDDeposit(
          walletClient?.account.address
        );
      console.log(fetchedTotalStakedValue, "fetchedTotalStakedValue");

      const fixedtotal = ethers.formatUnits(fetchedTotalStakedValue, 18);
      setTotalStakedValue(fixedtotal);
      console.log(fixedtotal, "fixedtotal");
      console.log(fetchedTotalStakedValue, "fetchedTotalStakedValue");
      console.log(totalStakedValue, "totalStaked");
    };

    const getLiquidationReserve = async () => {
      const lr = await troveManagerContract.LUSD_GAS_COMPENSATION();
      const lrFormatted = Number(ethers.formatUnits(lr, 18));
      setLr(lrFormatted);
      console.log({ lr, lrFormatted });
    };

    const getPrice = async () => {
      try {
        if (!provider || hasPriceFetched) return null;
        const fetchedPrice = await priceFeedContract.getPrice();
        // const convertedFetchedPrice = (fetchedPrice / _1e18).toString();
        const convertedFetchedPrice = ethers.formatUnits(fetchedPrice, 18);
        setPrice(Number(convertedFetchedPrice));
        console.log(convertedFetchedPrice, "Fetched price");
      } catch (error) {
        console.error(error, "error");
      } finally {
        setHasPriceFetched(true);
      }
    };

    const getRecoveryModeStatus = async () => {
      const status: boolean = await troveManagerContract.checkRecoveryMode(
        price
      );
      setIsRecoveryMode(status);
    };

    const getStaticData = async () => {
      if (!walletClient) return null;
      if (!provider || hasGotStaticData) return null;

      const { 0: debt, 1: coll } =
        await troveManagerContract.getEntireDebtAndColl(
          walletClient.account.address
        );

      const expectedBorrowingRate =
        await troveManagerContract.getBorrowingRateWithDecay();

      const borrowingRate = Number(
        ethers.formatUnits(expectedBorrowingRate, 18)
      );
      const expectedFeeFormatted = borrowingRate / 100;

      setStaticBorrowingFee(expectedFeeFormatted);

      const debtFormatted = Number(ethers.formatUnits(debt, 18));
      const collFormatted = Number(ethers.formatUnits(coll, 18));

      setStaticCollAmount(collFormatted);

      // total coll
      const totalColl = collFormatted * price;
      setStaticTotalCollateral(totalColl);
      setStaticTotalDebt(debtFormatted);

      //ltv
      const ltvValue = (debtFormatted * 100) / (totalColl || 1); // if collTotal is 0/null/undefined then it will be divided by 1
      setStaticLtv(ltvValue);

      //liquidationPrice
      const divideBy = isRecoveryMode ? 1.5 : 1.1;
      const liquidationPriceValue = (divideBy * debtFormatted) / collFormatted;
      setStaticLiquidationPrice(liquidationPriceValue);

      console.log({
        debt,
        coll,
        collFormatted,
        debtFormatted,
        totalColl,
        ltvValue,
      });
      setHasGotStaticData(true);
    };

    getPrice();
    getRecoveryModeStatus();
    getLiquidationReserve();
    getStaticData();
    ///////////////////
    fetchedData();
    getSystemLTV();
    getTroveStatus();
    getStakedValue();
  }, []);

  useDebounce(
    () => {
      makeCalculations(userInputs.borrow, userInputs.depositCollateral);
    },
    1000,
    [userInputs.borrow, userInputs.depositCollateral]
  );

  const handleConfirmClick = async (xBorrow: string, xCollatoral: string) => {
    try {
      // const collateralBeforeConv = new Decimal(userInputs.depositCollateral);
      // const borrowBeforeConv = new Decimal(userInputs.borrow);

      // const collIncrease: string = collateralBeforeConv.mul(pow).toFixed();
      // const LUSDRepayment: string = borrowBeforeConv.mul(pow).toFixed();

      const borrowValue = Number(xBorrow);
      const collValue = Number(xCollatoral);

      if (!walletClient) return null;
      const { 0: debt, 1: coll } =
        await troveManagerContract.getEntireDebtAndColl(
          walletClient.account.address
        );

      const debtFormatted = Number(ethers.formatUnits(debt, 18));
      const collFormatted = Number(ethers.formatUnits(coll, 18));

      const newDebtValue = debtFormatted + borrowValue;
      const newCollValue = collFormatted + collValue;
      console.log({
        borrowValue,
        collValue,
        debt,
        coll,
        debtFormatted,
        collFormatted,
        newDebtValue,
        newCollValue,
      });
      // const newDebtValue = Number(toBigInt(debt) + toBigInt(LUSDRepayment));
      setNewDebt(newDebtValue);
      // const newColl = toBigInt(coll) + toBigInt(collIncrease);

      // const _1e20Before = new Decimal("100");
      // const _1e20 = toBigInt(_1e20Before.mul(pow).toFixed());

      // NICR = newColl.mul(_1e20).div(newDebt)
      // let NICR: bigint =
      // 	(toBigInt(newCollValue) * toBigInt(_1e20)) / toBigInt(newDebtValue);
      // let NICR = newCollValue / newDebtValue;
      // console.log(NICR, "NICR");

      // const bigNICRWithDecimals = BigInt(
      // 	ethers.parseUnits(NICR.toString(), 20)
      // );

      // console.log(bigNICRWithDecimals);

      let NICR = newCollValue / newDebtValue;
      console.log(NICR, "NICR");

      const NICRDecimal = new Decimal(NICR.toString());
      const NICRBigint = BigInt(NICRDecimal.mul(pow20).toFixed());
      console.log(NICRBigint, "NICRBigint");

      const numTroves = await sortedTrovesContract.getSize();
      const numTrials = numTroves * BigInt("15");
      console.log(numTrials, "numTrials");

      const { 0: approxHint } = await hintHelpersContract.getApproxHint(
        // NICR,
        NICRBigint,
        numTrials,
        42
      ); // random seed of 42

      // Use the approximate hint to get the exact upper and lower hints from the deployed SortedTroves contract
      const { 0: upperHint, 1: lowerHint } =
        await sortedTrovesContract.findInsertPosition(
          // NICR,
          NICRBigint,
          approxHint,
          approxHint
        );

      const maxFee = "5".concat("0".repeat(16));
      const collDecimal = new Decimal(collValue.toString());
      const collBigint = BigInt(collDecimal.mul(pow18).toFixed());
      console.log(collBigint, "collBigint");

      const borrowDecimal = new Decimal(borrowValue.toString());
      const borrowBigint = BigInt(borrowDecimal.mul(pow18).toFixed());
      console.log(borrowBigint, "borrowBigint");

      // Call adjustTrove with the exact upperHint and lowerHint
      const borrowOpt = await borrowerOperationsContract.adjustTrove(
        maxFee,
        0,
        // LUSDRepayment,
        borrowBigint,
        // Number(userInputs.borrow) === 0 ? false : true,
        borrowValue === 0 ? false : true,
        upperHint,
        lowerHint,
        { value: collBigint }
      );
    } catch (error) {
      console.error(error, "Error");
    }
  };

  const makeCalculations = async (xBorrow: string, xCollatoral: string) => {
    const borrowValue = Number(xBorrow);
    const collValue = Number(xCollatoral);

    if (!walletClient) return null;

    const { 0: debt, 1: coll } =
      await troveManagerContract.getEntireDebtAndColl(
        walletClient.account.address
      );

    const expectedBorrowingRate =
      await troveManagerContract.getBorrowingRateWithDecay();

    const borrowingRate = Number(ethers.formatUnits(expectedBorrowingRate, 18));
    const debtFormatted = Number(ethers.formatUnits(debt, 18));
    const collFormatted = Number(ethers.formatUnits(coll, 18));

    const expectedFeeFormatted = (borrowingRate * borrowValue) / 100;
    // const totalColl = collFormatted + collValue; //do we have to multiply it by price
    const totalColl = (collFormatted + collValue) * Number(price); // multiply it by price
    setTotalCollateral(totalColl);
    const debtTotal = expectedFeeFormatted + borrowValue + debtFormatted;

    const ltvValue = (debtTotal * 100) / (totalColl || 1);
    const divideBy = isRecoveryMode ? 1.5 : 1.1;
    const liquidationPriceValue =
      (divideBy * debtTotal) / (collFormatted + collValue);
    const availBorrowValue =
      totalColl / divideBy - debtFormatted - expectedFeeFormatted;
    setAvailableBorrow(Number(availBorrowValue.toFixed(3)));
    console.log({
      borrowingRate,
      totalColl,
      debtTotal,
      ltvValue,
      expectedFeeFormatted,
      collValue,
      borrowValue,
      liquidationPriceValue,
      availBorrowValue,
    });
    setBorrowingFee(Number(expectedFeeFormatted.toFixed(3)));
    setTotalDebt(Number(debtTotal.toFixed(3)));
    setLtv(Number(ltvValue.toFixed(3)));
    setLiquidationPrice(Number(liquidationPriceValue.toFixed(3)));
  };

  const divideBy = isRecoveryMode ? 1.5 : 1.1;

  const availableToBorrow = price / divideBy - Number(entireDebtAndColl.debt);

  const liquidation =
    divideBy *
    (Number(entireDebtAndColl.debt) / Number(entireDebtAndColl.coll));
  //   console.log("nk1", walletClient?.account.address);
  const handlePercentageClick = (percentage: any) => {
    const pow = Decimal.pow(10, 18);
    const _1e18 = toBigInt(pow.toFixed());
    const percentageDecimal = new Decimal(percentage).div(100);
    const pusdBalanceNumber = parseFloat(fetchedPrice);
    if (!isNaN(pusdBalanceNumber)) {
      const maxStake = new Decimal(pusdBalanceNumber).mul(percentageDecimal);
      const stakeFixed = maxStake.toFixed();
      const stakeFixedConv = (toBigInt(stakeFixed) / _1e18).toString();
      setUserInput(stakeFixedConv);
    } else {
      console.error("Not enough pusd to unstake:", pusdBalanceNumber);
    }
  };
  ////////////////////////

  const getTroveStatus = async () => {
    console.log("nitu1", walletClient?.account.address);
    if (!walletClient) return null;
    const troveStatusBigInt = await troveManagerContract.getTroveStatus(
      walletClient?.account.address
    );
    const troveStatus =
      troveStatusBigInt.toString() === "1" ? "ACTIVE" : "INACTIVE";
    setTroveStatus(troveStatus);
    console.log("nitu2");
    console.log("nitu3", { troveStatusBigInt, troveStatus });
  };

  getTroveStatus();

  console.log({ troveStatus });
  return (
    <div>
      {troveStatus === "INACTIVE" && (
        <div className="flex flex-col gap-10 my-[2.5rem] ml-[2.5rem] mr-[2.5rem]">
          {/* Hesading */}
          <div className="flex  flex-row justify-between">
            <div>
              <p className="text-white text-sm mt-2 mb-4 ml-5">
                Portfolio Value
              </p>

              <span className="text-white text-2xl font-bold ml-5">
                ${availableToBorrow} PUSD
              </span>
            </div>

            <div className="w-2/3 h-2">
              <Progress total={totalSupply} supplied={suppliedAmount} />
              <h1 className="text-white text-sm ">
                <div className="flex flex-row justify-between">
                  {/*  const totalSupply = 100;
  const suppliedAmount = 40; */}
                  <div className="text-white flex flex-col">
                    <span>Borrowed</span>
                    <span>{suppliedAmount}</span>
                  </div>
                  <div className="text-white flex flex-col">
                    <span>Supplied</span>
                    <span>{totalSupply - suppliedAmount}</span>
                  </div>
                </div>
              </h1>
            </div>
          </div>
          {/* Boxes */}
          <div className="mt-10 flex flex-row justify-between gap-10">
            {/* box1 */}
            <div
              className="w-[35rem] h-[23.6rem] ml-[2.5rem] rounded-sm"
              style={{ backgroundColor: "#3f3b2d" }}
            >
              {/* nav */}
              <div
                className="  flex flex-row justify-between p-5"
                style={{ backgroundColor: "#3d3f37" }}
              >
                <span className="text-white">TROVE</span>

                <button
                  style={{ backgroundColor: "#f5d64e" }}
                  className="h-10 px-8 bg-yellow-300 text-black font-bold"
                >
                  Details
                </button>
              </div>
              {/* body */}
              <div>
                <div className="flex flex-col place-items-center mt-2 mb-8">
                  <Knob
                    value={value}
                    onChange={(e) => setValue(e.value)}
                    size={100}
                    // showValue={false}
                    rangeColor="#78887f"
                    valueColor="#3dde84"
                    strokeWidth={10}
                  />
                  <span className="text-xs ml-2">{value}%</span>
                  <span className="text-xs ml-2">/100%</span>
                  <span className="text-xs ml-2">YOUR LTV</span>
                </div>
                <div className="text-white flex flex-row justify-between mx-[2.5rem]">
                  {" "}
                  <div className="flex flex-col">
                    <span>Collateral</span>
                    <span>{entireDebtAndColl.coll} PUSD</span>
                    <span className="text-xs">${price}</span>
                  </div>
                  <div className="flex flex-col">
                    {" "}
                    <span>Debt</span>
                    <span>{entireDebtAndColl.debt} PUSD</span>
                  </div>
                  <div className="flex flex-col">
                    {" "}
                    <span>Debt Ahead</span>
                    <span>{entireDebtAndColl.pendingETHReward} PUSD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* box2 */}
            <div
              className="w-[22rem] h-[23.6rem] ml-[2.5rem] rounded-sm"
              style={{ backgroundColor: "#3f3b2d" }}
            >
              <div
                className="  flex flex-row justify-between p-5"
                style={{ backgroundColor: "#3d3f37" }}
              >
                <span className="text-white">STABILITY POOL</span>

                <button
                  style={{ backgroundColor: "#f5d64e" }}
                  className="h-10 px-6 bg-yellow-300 text-black font-bold"
                >
                  Details
                </button>
              </div>
              <div className="text-white ml-3">
                <div className="mb-8">
                  <p>Deposited</p>
                  <p>0 PUSD</p>
                </div>
                <div className="flex flex-row gap-10">
                  <div className="flex flex-col">
                    <span>Claimable</span>
                    <span>{lr} PUSD</span>
                  </div>
                  <Image src={port2} alt="home" width={200} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {troveStatus === "ACTIVE" && (
        <div className="mt-10 flex flex-row justify-between gap-10">
          <div
            className="w-[35rem] h-[23.6rem] ml-[2.5rem] rounded-sm"
            style={{ backgroundColor: "#3f3b2d" }}
          >
            <div
              className="  flex flex-row justify-between p-5"
              style={{ backgroundColor: "#3d3f37" }}
            >
              <span className="text-white">TROVE</span>

              <button
                style={{ backgroundColor: "#f5d64e" }}
                className="h-10 px-8 bg-yellow-300 text-black font-bold"
              >
                <Link href="/Borrow">OPEN TROVE</Link>
              </button>
            </div>
            <div className="grid place-items-center">
              <Image src={img1} alt="home" width={200} />
              <p className="text-white text-center font-semibold text-lg mt-4">
                You don't have an Active Trove
              </p>
            </div>
          </div>
          <div
            className="w-[22rem] h-[23.6rem] ml-[2.5rem] rounded-sm"
            style={{ backgroundColor: "#3f3b2d" }}
          >
            <div
              className="  flex flex-row justify-between p-5"
              style={{ backgroundColor: "#3d3f37" }}
            >
              <span className="text-white">STABILITY POOL</span>

              <button
                style={{ backgroundColor: "#f5d64e" }}
                className="h-10 px-6 bg-yellow-300 text-black font-bold"
              >
                <Link href="/Stake">STAKE PUSD</Link>
              </button>
            </div>
            <div className="grid place-items-center">
              <Image src={port2} alt="home" width={200} />
              <p className="text-white text-center font-semibold text-lg mt-4">
                You have not Staked
              </p>
            </div>
          </div>
        </div>
      )}
      {!troveStatus && (
        <div className="mt-10 flex flex-row justify-between gap-10">
          <div
            className="w-[35rem] h-[23.6rem] ml-[2.5rem] rounded-sm"
            style={{ backgroundColor: "#3f3b2d" }}
          >
            <div
              className="  flex flex-row justify-between p-5"
              style={{ backgroundColor: "#3d3f37" }}
            >
              <span className="text-white">TROVE</span>

              <button
                style={{ backgroundColor: "#f5d64e" }}
                className="h-10 px-8 bg-yellow-300 text-black font-bold"
              >
                Connect Wallet
                {/* <Link href="/Borrow">OPEN TROVE</Link> */}
              </button>
            </div>
            <div className="grid place-items-center">
              <Image src={img1} alt="home" width={200} />
              <p className="text-white text-center font-semibold text-lg mt-4">
                You don't have an Active Trove
              </p>
            </div>
          </div>
          <div
            className="w-[22rem] h-[23.6rem] ml-[2.5rem] rounded-sm"
            style={{ backgroundColor: "#3f3b2d" }}
          >
            <div
              className="  flex flex-row justify-between p-5"
              style={{ backgroundColor: "#3d3f37" }}
            >
              <span className="text-white">STABILITY POOL</span>

              <button
                style={{ backgroundColor: "#f5d64e" }}
                className="h-10 px-4 bg-yellow-300 text-black font-bold"
              >
                {/* <Link href="/Stake">STAKE PUSD</Link> */}
                Connect Wallet
              </button>
            </div>
            <div className="grid place-items-center">
              <Image src={port2} alt="home" width={200} />
              <p className="text-white text-center font-semibold text-lg mt-4">
                You have not Staked
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
