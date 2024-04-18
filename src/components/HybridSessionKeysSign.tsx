import { OffchainSessionAccountV5, createSessionAccount } from "@argent/x-sessions";
import { FC, useState } from "react";
import { Account, AccountInterface, RpcProvider } from "starknet";

import { StarknetWindowObject } from "get-starknet-core";
import { getStarkKey, utils } from "micro-starknet";
import { createSessionKeys } from "@/helpers/createSessionKeys";
import { Status } from "@/helpers/status";
import { ETHTokenAddress, provider } from "@/constants";
import { parseInputAmountToUint256 } from "@/helpers/token";

interface HybridSessionKeysSignProps {
  account: AccountInterface;
  setTransactionStatus: (status: Status) => void;
  setHybridSessionAccount: (account: Account) => void;
}

const HybridSessionKeysSign: FC<HybridSessionKeysSignProps> = ({
  account,
  setTransactionStatus,
  setHybridSessionAccount,
}) => {
  const [allowedFees, setAllowedFees] = useState("");

  const handleCreateSessionSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setTransactionStatus("approve");
      setHybridSessionAccount(
        await createSessionAccount({
          provider: provider as any,
          account: account as any,
          allowedMethods: [
            {
              "Contract Address": ETHTokenAddress,
              selector: "transfer",
            },
          ],
          expiry: Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000) as any,
        })
      );

      setTransactionStatus("success");
    } catch (e) {
      console.error(e);
      setTransactionStatus("idle");
    }
  };

  return (
    <form onSubmit={handleCreateSessionSubmit} className="flex flex-col p-4 gap-3">
      <h2 className="text-white">Create session keys</h2>
      <button className="bg-blue-300 p-2 rounded-lg" type="submit">
        Authorize session
      </button>
    </form>
  );
};

export { HybridSessionKeysSign };
