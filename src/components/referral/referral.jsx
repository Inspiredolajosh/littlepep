import React from "react";
import { ethers } from "ethers";

const ReferralLinkComponent = ({ isConnected, defaultAccount, claimTokens }) => {
  const domainName = "https://littlepepe.netlify.app";
  const referralLink = isConnected ? `${domainName}/?ref=${defaultAccount}` : "";

  const handleCopyButtonClick = async () => {
    if (referralLink) {
      try {
        await navigator.clipboard.writeText(referralLink);
        alert("Referral link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  };


  return (
    <div className="referral">
      <div className="container">
        <input type="text" value={referralLink} placeholder="your referral link" readOnly />
        <button onClick={handleCopyButtonClick}>Copy</button>
      </div>
    </div>
  );
};

export default ReferralLinkComponent;
