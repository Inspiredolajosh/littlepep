import React from "react";

const ReferralLinkComponent = ({ isConnected, defaultAccount }) => {
  const domainName = "http://127.0.0.1:5173";
  const referralLink = isConnected ? `${domainName}/?ref=${defaultAccount}` : "";

  const handleCopyButtonClick = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink).then(() => {
        alert("Referral link copied to clipboard!");
      });
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
