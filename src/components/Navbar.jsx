import React, { useState } from 'react';
import { ethers } from 'ethers'; // Ensure ethers is imported
import './Navbar.css'; // Assuming you have a CSS file for styling

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error("Ethereum object is not defined. Please install MetaMask.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address); // Update state with wallet address
      console.log("Wallet connected:", address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">My App</h1>
      <div className="navbar-buttons">
        {walletAddress ? (
          <span className="wallet-address">{walletAddress}</span> // Display wallet address
        ) : (
          <button className="connect-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;