"use client";

import { OffchainSessionKeysExecute } from "@/components/OffchainSessionKeysExecute";
import { OffchainSessionKeysSign } from "@/components/OffchainSessionKeysSign";
import { provider } from "@/constants";
import { Status } from "@/helpers/status";
import { OffchainSessionAccountV5 } from "@argent/x-sessions";
import { useEffect, useState } from "react";
import { GatewayError, constants } from "starknet";
import { StarknetWindowObject, connect } from "starknetkit";

export default function Home() {
  const [connectedWallet, setConnectedWallet] = useState<StarknetWindowObject | undefined | null>(null);
  const [chainId, setChainId] = useState<string>();

  const [lastTransactionHash, setLastTransactionHash] = useState("");
  const [transactionStatus, setTransactionStatus] = useState<Status>("idle");
  const [transactionError, setTransactionError] = useState("");
  const [offchainSessionAccount, setOffchainSessionAccount] = useState<OffchainSessionAccountV5 | undefined>();

  const connectFn = async () => {
    const { wallet } = await connect({
      provider,
      modalMode: "alwaysAsk",
      webWalletUrl: "https://web.hydrogen.argent47.net",
      argentMobileOptions: {
        dappName: "Argent | Portfolio",
        url: window.location.hostname,
        chainId: constants.NetworkName.SN_SEPOLIA,
        icons: [],
      },
    });

    setConnectedWallet(wallet);
    setChainId(await wallet?.account?.getChainId());
  };

  useEffect(() => {
    const waitTx = async () => {
      if (lastTransactionHash && transactionStatus === "pending") {
        setTransactionError("");
        try {
          await provider.waitForTransaction(lastTransactionHash);
          setTransactionStatus("success");
        } catch (error) {
          setTransactionStatus("failure");
          let message = error ? `${error}` : "No further details";
          if (error instanceof GatewayError) {
            message = JSON.stringify(error.message, null, 2);
          }
          setTransactionError(message);
        }
      }
    };
    waitTx();
  }, [transactionStatus, lastTransactionHash]);

  return (
    <main className="flex min-h-screen flex-col p-24 gap-4">
      <div>
        {!connectedWallet && (
          <button className="bg-white text-black p-2 radius rounded-md" onClick={connectFn}>
            connect wallet
          </button>
        )}
      </div>

      {connectedWallet && connectedWallet.account && (
        <>
          <div>Account: {connectedWallet.account?.address}</div>
          <div>Chain: {chainId === constants.StarknetChainId.SN_SEPOLIA ? "SN_SEPOLIA" : "SN_MAIN"}</div>
          <div
            className={`${lastTransactionHash ? "cursor-pointer hover:underline" : "default"}`}
            onClick={() => {
              if (!lastTransactionHash) return;
              window.open(`https://sepolia.starkscan.co/tx/${lastTransactionHash}`, "_blank");
            }}
          >
            Last tx hash: {lastTransactionHash || "---"}
          </div>
          <div>Tx status: {transactionStatus}</div>
          <div color="##ff4848">{transactionError.toString()}</div>

          <div className="flex flex-col text-black max-w-96">
            <OffchainSessionKeysSign
              account={connectedWallet.account as any}
              setTransactionStatus={setTransactionStatus}
              setOffchainSessionAccount={setOffchainSessionAccount}
            />
          </div>

          <div className="flex flex-col text-black max-w-96">
            <OffchainSessionKeysExecute
              account={connectedWallet.account as any}
              setTransactionStatus={setTransactionStatus}
              setLastTransactionHash={setLastTransactionHash}
              transactionStatus={transactionStatus}
              offchainSessionAccount={offchainSessionAccount}
            />
          </div>
        </>
      )}
    </main>
  );
}
