import { connect } from "starknetkit";
import { provider } from "@/constants";
import { constants } from "starknet";
import { FC, useEffect } from "react";

interface ConnectButtonProps {
  setConnectedWallet: (wallet: any) => void;
  setChainId: (chainId: string) => void;
}

const ConnectButton: FC<ConnectButtonProps> = ({ setChainId, setConnectedWallet }) => {
  const connectFn = async () => {
    const { wallet } = await connect({
      provider,
      modalMode: "alwaysAsk",
      webWalletUrl: "http://localhost:3005",
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
    const autoConnect = async () => {
      const { wallet } = await connect({
        provider,
        modalMode: "neverAsk",
        webWalletUrl: "http://localhost:3005",
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
    autoConnect();
  }, []);

  return (
    <button className="bg-white text-black p-2 radius rounded-md" onClick={connectFn}>
      connect wallet
    </button>
  );
};

export { ConnectButton };
