import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Ensure ethers is imported
import './Navbar.css'; // Assuming you have a CSS file for styling

const NETWORK_NAMES = {
  1: "Ethereum Mainnet",
  3: "Ropsten Testnet",
  4: "Rinkeby Testnet",
  5: "Goerli Testnet",
  42: "Kovan Testnet",
  11155111: "Sepolia Testnet",
};

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState(''); // State for current network
  const [balance, setBalance] = useState(''); // State for wallet balance
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

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

  const fetchNetworkAndBalance = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork(); // Get current network

    const networkName = NETWORK_NAMES[chainId] || `Unknown Network (${chainId})`;
    setNetwork(networkName); // Update network state

    const balance = await provider.getSigner().getBalance(); // Get wallet balance
    setBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(4)); // Update balance state
  };

  const disconnectWallet = () => {
    setWalletAddress(''); // Clear wallet address
    setNetwork(''); // Clear network
    setBalance(''); // Clear balance
    console.log("Wallet disconnected");
  };

  useEffect(() => {
    if (walletAddress) {
      fetchNetworkAndBalance(); // Fetch network and balance when wallet is connected
    }
  }, [walletAddress]);

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Site Board</h1>
      <div className="navbar-buttons">
        {walletAddress ? (
          <div>
            <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {walletAddress}
            </button>
            {dropdownOpen && (
              <div className="dropdown-content">
                <p>Network: {network}</p>
                <p>Balance: {balance} ETH</p>
                <button className="disconnect-button" onClick={disconnectWallet}>
                  Disconnect
                </button>
              </div>
            )}
          </div>
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
