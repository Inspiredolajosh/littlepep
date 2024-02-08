import React, { useState, useEffect } from "react";
import "./Form.scss";

const Form = ({ isConnected, defaultAccount, claimTokens }) => {
  const [referrerAddress, setReferrerAddress] = useState("");

  useEffect(() => {
    // Parse the referral link when the component mounts
    parseReferralLink();
  }, []);

  const parseReferralLink = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get("ref");
    if (refParam) {
      setReferrerAddress(refParam);
    }
  };

  const handleReferralInputChange = (event) => {
    setReferrerAddress(event.target.value);
  };

  const handleClaimButtonClick = () => {
    if (isConnected) {
      // Check if connected to BSC mainnet
      window.ethereum
        .request({ method: "eth_chainId" })
        .then((chainIdHex) => {
          const chainId = parseInt(chainIdHex, 16);
          if (chainId !== 97) {
            window.alert("BSC Testnet Only! Connect wallet and use the Switch Network button above.");
          } else {
            // Call the claimTokens function with the appropriate referrerAddress
            const referrerAddressToSend = referrerAddress.trim() !== "" ? referrerAddress : defaultAccount;
            claimTokens(referrerAddressToSend);
          }
        })
        .catch((error) => {
          console.error("Failed to get chainId:", error);
        });
    } else {
      window.alert("BSC Mainnet Only! Connect wallet and use the Switch Network button above.");
    }
  };

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="container">
        <div className="form__group">
          <label htmlFor="" className="form__label">
            Referral (optional)
          </label>
          <input
            type="text"
            className="form__input"
            placeholder="Enter referral link"
            value={referrerAddress}
            onChange={handleReferralInputChange}
          />
        </div>

        <div className="form__group">
          <button className="btn" onClick={handleClaimButtonClick}>Claim Airdrop</button>
        </div>
       
      </div>
    </form>
  );
};

export default Form;
