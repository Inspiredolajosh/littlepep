import React, { useEffect, useState } from "react";
import "./NavBar.scss";
import pepe from "../../assets/img/pepe.png";

const NavBar = ({ isConnected, connectWallet, defaultAccount, disconnectWallet, switchNetwork, isBscNetwork }) => {


  const truncateWalletAddress = (address) => {
    if (address) {
      const truncatedAddress = `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`;
      return truncatedAddress;
    }
    return null;
  };



  return (
    <div className="nav">
      <div className="container">
      <img src={pepe} alt="pepe" />
        {isConnected ? (
          <>
            <button className="nav__btn">{truncateWalletAddress(defaultAccount)}</button>
            <button className="nav__btn" onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
            <button className="nav__btn" onClick={switchNetwork}>
              Switch Network
            </button>
            {isBscNetwork && (
              <div className="nav__notification">You are on BSC Network</div>
            )}
          </>
        ) : (
          <button className="nav__btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
