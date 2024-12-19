// src/components/WalletConnect.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

console.log("Ethers object:", ethers);

const TestEthers = () => {
  useEffect(() => {
    console.log("Ethers object:", ethers);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("Web3Provider created:", provider);
    } catch (error) {
      console.error("Error creating Web3Provider:", error);
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert("Please install a wallet extension like MetaMask.");
        return; // Exit if no wallet is found
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      console.log("Wallet connected:", address);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      alert(`Connection rejected or error occurred: ${error.message}`); // Log the error message
    }
  };
};

export default TestEthers;