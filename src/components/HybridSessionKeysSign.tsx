import { createSessionAccount } from "@argent/x-sessions";
import { FC } from "react";
import { Account, AccountInterface } from "starknet";

import { ETHTokenAddress, provider } from "@/constants";
import { Status } from "@/helpers/status";

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
