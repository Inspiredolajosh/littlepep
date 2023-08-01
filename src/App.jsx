import React, { useState, useEffect } from "react";
import NavBar from "./components/navbar/NavBar";
import "./App.scss";

import pepe from "../src/assets/img/pepe.png";
import Form from "./components/form/Form";
import useWalletStore from "./components/Store";
import ReferralLinkComponent from "./components/referral/referral";

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Function to store the connected account in the browser storage
  const storeConnectedAccount = (accountName) => {
    localStorage.setItem("connectedAccount", accountName);
  };

  // Function to retrieve the connected account from the browser storage
  const getConnectedAccountFromStorage = () => {
    return localStorage.getItem("connectedAccount");
  };

  useEffect(() => {
    // On initial load, check if there's a connected account in the storage
    const storedAccount = getConnectedAccountFromStorage();
    if (storedAccount) {
      setDefaultAccount(storedAccount);
      setIsConnected(true);
    }
  }, []);

  const connectWallet = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            accountChanged(result[0]);
            storeConnectedAccount(result[0]); // Store the connected account in localStorage
          })
          .catch((error) => {
            console.error(error);
            setErrorMessage("Failed to connect to the wallet.");
          });
      } else {
        setErrorMessage(
          "Please install Metamask or another Ethereum wallet provider to connect."
        );
      }
    }
  };

  const disconnectWallet = () => {
    setDefaultAccount(null);
    setIsConnected(false);
    setErrorMessage(null);
    localStorage.removeItem("connectedAccount"); // Remove the connected account from localStorage
  };

  const accountChanged = (accountName) => {
    setDefaultAccount(accountName);
    setIsConnected(true);
  };

  return (
    <div className="app">
      <div className="container">
        <NavBar
          isConnected={isConnected}
          connectWallet={connectWallet}
          defaultAccount={defaultAccount}
          disconnectWallet={disconnectWallet}
        />

        <div className="intro">
          <div className="container">
            <p>You slept on my Dad, don't sleep on me.</p>
            <img src={pepe} alt="pepe" />

            <h1>Little Pepe</h1>

            <div className="intro__text">
              <p>
                Little PEPE is built on the BSC network and is a community-driven project.
              </p>
              <p>
                Connect wallet, claim airdrop and refer your friends to enjoy an unending benefit of LittlePepe
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Form />

        <div className="referal">
          <div className="container">
            {/* Display the Referral Link */}
            <ReferralLinkComponent isConnected={isConnected} defaultAccount={defaultAccount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
