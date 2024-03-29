import React, { useState, useEffect } from "react";
import NavBar from "./components/navbar/NavBar";
import "./App.scss";
import pepe from "../src/assets/img/pepe.png";
import Form from "./components/form/Form";
import ReferralLinkComponent from "./components/referral/referral";
import { ethers } from 'ethers';
import abi from './darktoken.json';

let provider = null;
let signer = null;
let contract = null;

// former contract 0x530494a64f2dBDCf80382ac18B656c0A0D1B7095


if (typeof window !== 'undefined' && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  const contractAddress = '0xDe50f6f87c37565B5C8640bE1B93E4A5D5C6B767';
  contract = new ethers.Contract(contractAddress, abi, signer);
}

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState(null);
  const [networkChainId, setNetworkChainId] = useState(null);
  const [referralCount, setReferralCount] = useState(0);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [totalTokensOwned, setTotalTokensOwned] = useState(ethers.BigNumber.from(0)); // Initialize as a BigNumber

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

  useEffect(() => {
    if (isConnected) {
      // Fetch the referral count for the default account
      const fetchReferralCount = async () => {
        try {
          const count = await contract.referralCount(defaultAccount);
          setReferralCount(count.toNumber());
        } catch (error) {
          console.error("Failed to fetch referral count:", error);
        }
      };

      fetchReferralCount();
    }
  }, [isConnected, defaultAccount]); // Added defaultAccount as a dependency

  useEffect(() => {
    const checkClaimStatus = async () => {
      if (isConnected) {
        try {
          const hasClaimed = await contract.hasClaimed(defaultAccount);
          setHasClaimed(hasClaimed);
        } catch (error) {
          console.error("Error checking claim status:", error);
        }
      }
    };

    checkClaimStatus();
  }, [isConnected, defaultAccount]);

  
  useEffect(() => {
    const fetchTotalTokensOwned = async () => {
      if (isConnected) {
        try {
          const totalTokens = await contract.totalTokensOwned(defaultAccount);
          setTotalTokensOwned(totalTokens);
        } catch (error) {
          console.error("Error fetching total tokens owned:", error);        
        }
      }
    };

    fetchTotalTokensOwned();
  }, [isConnected, defaultAccount]);

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
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            accountChanged(result[0]);
          })
          .catch((error) => {
            console.error(error);
            window.alert("Failed to connect to the wallet.");
          });
      } else {
        window.alert("Please install Metamask or another Ethereum wallet provider to connect.");
      }
    }
  };

  const disconnectWallet = () => {
    setDefaultAccount(null);
    setIsConnected(false);
    setErrorMessage(null);
    localStorage.removeItem("connectedAccount"); 
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
        window.alert("Invalid address or ENS name.");
        return;
      }
  
      // Check if the current network is BSC Mainnet (chainId 56)
      const network = await provider.getNetwork();
      if (network.chainId !== 97) {
        window.alert("BSC Testnet Only! Use the Switch Network button above.");
        return;
      }
  
      // Check if the user has already claimed tokens
      const hasAlreadyClaimed = await contract.hasClaimed(defaultAccount);
      if (hasAlreadyClaimed) {
        window.alert("You have already claimed your tokens");
        return;
      }
  
      const price = ethers.utils.parseEther("0.0034");
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
      window.alert("Runtime Error!");
    }
  };
  
  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }], 
      });
      window.location.reload()
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to switch network. Please switch EVM Network to BSC in your wallet.");
    }
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
            {/* Display the referral count */}
    {isConnected && (
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#38d324', /* Green */
          border: 'none',
          color: 'white',
          textAlign: 'center',
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: '16px',
          borderRadius: '8px',
          cursor: 'default' /* Set cursor to default to indicate non-clickable */
        }}
      >
        Total Referral: {referralCount}
      </button>
    )}


          {/* <div className="container">
            <p>You slept on my Dad, don't sleep on me.</p>
            
            <img src={pepe} alt="pepe" />

            <h1>Little Pepe</h1>
            <h2>Contract Address: 0x530494a64f2dBDCf80382ac18B656c0A0D1B7095</h2>

            <div className="intro__text">
              <p>
                Little PEPE is built on the BSC network and is a community-driven project.
                
              </p>
              <p>
      Claim your 1 billion $LPEPE worth $40. <br />
      Share your referral link and earn 100 million tokens worth $4 per referral.<br />
      Listing in days, stay glued to our twitter page.<br />
      Airdrop ending soon! 
    </p>
            </div>
          </div> */}

          
        </div>
<br />
{isConnected && (
  <button
    style={{
      padding: '10px 20px',
      backgroundColor: '#38d324', /* Green */
      border: 'none',
      color: 'white',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '16px',
      borderRadius: '8px',
      cursor: 'default' /* Set cursor to default to indicate non-clickable */
    }}
  >
    Total Tokens Owned: {ethers.utils.formatUnits(totalTokensOwned, 18)} DRT
  </button>
)}

        {/* Form */}
        <Form  isConnected={isConnected} defaultAccount={defaultAccount} claimTokens={claimTokens} />

        
    


        <div className="referal">
  <div className="container">
    {/* Conditionally render the ReferralLinkComponent */}
    {isConnected && hasClaimed && (
      <ReferralLinkComponent isConnected={isConnected} defaultAccount={defaultAccount} claimTokens={claimTokens} />
    )}
{/* Display a message if the user has not claimed tokens */}
{isConnected && !hasClaimed && (
  <p style={{ fontSize: '18px', color: 'white' }}>Please claim your tokens to generate the referral link.</p>
)}

  </div>
</div>



      </div>

      
    </div>

    
  );
}

export default App;
