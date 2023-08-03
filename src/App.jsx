import React, { useState, useEffect } from "react";
import NavBar from "./components/navbar/NavBar";
import "./App.scss";
import pepe from "../src/assets/img/pepe.png";
import Form from "./components/form/Form";
import ReferralLinkComponent from "./components/referral/referral";
import { ethers } from 'ethers';
import abi from './littlepepe.json';


const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = '0x04d5b6cBC301E1148c12B509ACb4730c2A5D1D41'; 
const contract = new ethers.Contract(contractAddress, abi, signer);

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState(null);
  const [networkChainId, setNetworkChainId] = useState(null);



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
    logContractConnection();
    updateNetworkChainId();
  }, []);

  const updateNetworkChainId = async () => {
    try {
      const network = await provider.getNetwork();
      setNetworkChainId(network.chainId);
    } catch (error) {
      console.error("Failed to get network information:", error);
    }
  };

  const logContractConnection = async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      console.log("Contract connected");
      console.log("Connected contract address:", contractAddress);
      try {
        const network = await contract.signer.provider.getNetwork();
        console.log("Connected network chainId:", network.chainId);
      } catch (error) {
        console.error("Failed to get network information:", error);
      }
    } else {
      console.log("Contract not connected");
    }
  };
  
  const connectWallet = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_chainId" })
          .then((chainId) => {
            if (chainId === '0x61') {
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
              setErrorMessage("Please switch to the BSC testnet to connect.");
            }
          })
          .catch((error) => {
            console.error(error);
            setErrorMessage("Failed to get network information.");
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

  const claimTokens = async (referrerAddress) => {
    try {
      // Check if referrerAddress is an ENS name
      if (typeof referrerAddress === 'string' && referrerAddress.includes('.eth')) {
        const resolvedAddress = await provider.resolveName(referrerAddress);
        referrerAddress = resolvedAddress;
      }
  
      // Check if referrerAddress is a valid Ethereum address
      if (!ethers.utils.isAddress(referrerAddress)) {
        window.alert("Invalid Ethereum address or ENS name.");
        return;
      }
  
      // Check if the current network is BSC testnet (chainId 97)
      const network = await provider.getNetwork();
      if (network.chainId !== 97) {
        window.alert("Bsc Network Only! use Switch Network button above.");
        return;
      }
  
      const price = ethers.utils.parseEther("0.00035");
      const transactionParameters = {
        value: price,
      };
  
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const transaction = await contractWithSigner.claimTokens(referrerAddress, transactionParameters);
      await transaction.wait();
  
      window.alert("Airdrop claimed successfully!");
    } catch (error) {
      console.error(error);
      window.alert("Failed to claim airdrop, please check your connection.");
    }
  };
  
  


  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
      });
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to switch network. Please switch EVM Network to BSC in your wallet.");
    }
  };

  const closeErrorMessage = () => {
    setErrorMessage(null);
  };


  return (
    <div className="app">
      <div className="container">
      <NavBar
          isConnected={isConnected}
          connectWallet={connectWallet}
          defaultAccount={defaultAccount}
          disconnectWallet={disconnectWallet}
          switchNetwork={switchNetwork}
          isBscNetwork={networkChainId === '0x61'}
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
        <Form  isConnected={isConnected} defaultAccount={defaultAccount} claimTokens={claimTokens} />

        
    

        <div className="referal">
          <div className="container">
            {/* Display the Referral Link */}
            <ReferralLinkComponent isConnected={isConnected} defaultAccount={defaultAccount} claimTokens={claimTokens} />

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
