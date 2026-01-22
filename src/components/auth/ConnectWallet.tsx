import React, { useCallback, useEffect, useRef } from "react";

import { coinbaseWallet } from "../../connectors/coinbaseWallet";
import { metaMask } from "../../connectors/metaMask";
import { walletConnect } from "../../connectors/walletConnect";

import Metamask from "../../assets/wallet/Metamask.svg";
import Phantom from "../../assets/wallet/Phantom.svg";
import Coinbase from "../../assets/wallet/Coinbase.svg";
import WalletConnect from "../../assets/wallet/WalletConnect.svg";
import ConnectWalletButton from "./ConnectWalletButton";

interface ConnectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedWallet: React.Dispatch<
    React.SetStateAction<"MetaMask" | "WalletConnect" | "Coinbase" | null>
  >;
}
const ConnectWallet: React.FC<ConnectModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  setSelectedWallet,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const id = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(id);
    };
  }, [isModalOpen, setIsModalOpen]);
  const activateConnector = useCallback(async (label: string) => {
    switch (label) {
      case "MetaMask":
        await metaMask.activate();
        setSelectedWallet(label);
        window.localStorage.setItem("connectorId", "injected");
        break;

      case "WalletConnect":
        await walletConnect.activate();
        setSelectedWallet(label);
        window.localStorage.setItem("connectorId", "wallet_connect");
        break;

      case "Coinbase":
        await coinbaseWallet.activate();
        setSelectedWallet(label);
        window.localStorage.setItem("connectorId", "injected");

        break;

      default:
        break;
    }
  }, [setSelectedWallet]);
  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connect-wallet-title"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="absolute inset-0 bg-black/60"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div
              ref={dialogRef}
              tabIndex={-1}
              className="w-full max-w-md rounded-2xl bg-custom-gradient p-6 shadow-2xl outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                id="connect-wallet-title"
                className="text-3xl font-semibold text-white font-poppins"
              >
                Connect a wallet
              </h2>
              <div>
                <p className="self-start text-base leading-10 text-gray-300 font-inter">
                  Don't have an account?
                  <a
                    href="#aa"
                    className="ml-1 font-semibold text-primary-900-high-emphasis hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900-high-emphasis/50 rounded-sm"
                  >
                    Register here
                  </a>
                </p>
                <div className="mt-6 flex flex-col gap-4">
                  <ConnectWalletButton image={Metamask} label="MetaMask" activateConnector={activateConnector} />
                  <ConnectWalletButton image={Phantom} label="Phantom" activateConnector={activateConnector} />
                  <ConnectWalletButton image={Coinbase} label="Coinbase" activateConnector={activateConnector} />
                  <ConnectWalletButton image={WalletConnect} label="WalletConnect" activateConnector={activateConnector} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectWallet;
