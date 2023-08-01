import { useState } from "react";

const useWalletStore = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState(null);

  const getReferralLink = () => {
    const domainName = "http://127.0.0.1:5173";
    return isConnected && defaultAccount ? `${domainName}/${defaultAccount}` : "";
  };

  const connectWallet = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            accountChanged(result[0]);
          })
          .catch((error) => {
            console.error(error);
            setErrorMessage("Failed to connect to the wallet.");
          });
      } else {
        setErrorMessage("Please install Metamask or another Ethereum wallet provider to connect.");
      }
    }
  };

  const disconnectWallet = () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      window.ethereum.selectedAddress = null;
    }
    setDefaultAccount(null);
    setIsConnected(false);
    setErrorMessage(null);
  };

  const accountChanged = (accountName) => {
    setDefaultAccount(accountName);
    setIsConnected(true);
  };

  return {
    errorMessage,
    defaultAccount,
    isConnected,
    notification,
    connectWallet,
    disconnectWallet,
    accountChanged,
    getReferralLink,
  };
};

export default useWalletStore;
