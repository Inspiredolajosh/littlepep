import React, { useState, useEffect } from "react";
import "./Form.scss";

const Form = () => {
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

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        // Perform the action when the form is submitted (e.g., claim airdrop)
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
          <button className="btn">Claim Airdrop</button>
        </div>
      </div>
    </form>
  );
};

export default Form;
