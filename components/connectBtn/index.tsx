"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../ui/button";

export const CustomConnectButton = () => {
	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				openAccountModal,
				openChainModal,
				openConnectModal,
				authenticationStatus,
				mounted,
			}) => {
				const ready = mounted && authenticationStatus !== "loading";
				const connected =
					ready &&
					account &&
					chain &&
					(!authenticationStatus || authenticationStatus === "authenticated");
				return (
					<div
						{...(!ready && {
							"aria-hidden": true,
							style: {
								opacity: 0,
								pointerEvents: "none",
								userSelect: "none",
							},
						})}
					>
						{(() => {
							if (!connected) {
								return (
									<Button onClick={openConnectModal}
										style={{
											display: "flex",
											alignItems: "center",
											backgroundColor: "#383427",
											height: 50,
											borderRadius: 3,
										}}>
										Connect Wallet
									</Button>
								);
							}
							if (chain.unsupported) {
								return (
									<Button
										onClick={openChainModal}
										type="button"
										variant={"destructive"}
									>
										Wrong network
									</Button>
								);
							}
							return (
								<div style={{ display: "flex", gap: 12 }}>
									<Button
										onClick={openChainModal}
										style={{
											display: "flex", alignItems: "center", backgroundColor: "#383427",

											height: 50,

										}}
									>
										{chain.hasIcon && (
											<div
												style={{
													width: 28,
													height: 28,
													borderRadius: 0,
													marginRight: 4,
												}}
											>
												{chain.iconUrl && (
													<img

														alt={chain.name ?? "Chain icon"}
														src={chain.iconUrl}
														style={{ width: 28, height: 28 }}
													/>
												)}
											</div>
										)}
										{chain.name}
									</Button>
									<Button onClick={openAccountModal}
										style={{
											display: "flex", alignItems: "center", height: 50,
											backgroundColor: "#383427"
										}}

									>
										{account.displayName}
										{account.displayBalance
											? ` (${account.displayBalance})`
											: ""}
									</Button>
								</div>
							);
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
};
