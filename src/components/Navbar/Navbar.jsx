import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './Navbar.css';
import { FaWallet, FaEthereum, FaNetworkWired } from 'react-icons/fa'; // Icons for wallet, Ethereum, and network
import { FiLogOut } from 'react-icons/fi'; // Icon for disconnect

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
  const [network, setNetwork] = useState('');
  const [balance, setBalance] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      setWalletAddress(address);
      console.log("Wallet connected:", address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const fetchNetworkAndBalance = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();

    const networkName = NETWORK_NAMES[chainId] || `Unknown Network (${chainId})`;
    setNetwork(networkName);

    const balance = await provider.getSigner().getBalance();
    setBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(4));
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setNetwork('');
    setBalance('');
    console.log("Wallet disconnected");
  };

  useEffect(() => {
    if (walletAddress) {
      fetchNetworkAndBalance();
    }
  }, [walletAddress]);

  return (
    <nav className="navbar">
      <h1 className="navbar-title">
        Site Board
      </h1>
      <div className="navbar-buttons">
        {walletAddress ? (
          <div>
            <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span className="icon-text">
              <FaWallet style={{ marginRight: '10px' }} />
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-content" style={{ minWidth: '300px' }}>
              <span className="icon-text">
                <FaNetworkWired style={{ marginRight: '10px' }} />
                Network: {network}
              </span>
              <span className="icon-text">
                <FaEthereum style={{ marginRight: '10px' }} />
                Balance: {balance} ETH
              </span>
              <div className="disconnect-container">
                <button className="disconnect-button" onClick={disconnectWallet}>
                  <span className="icon-text">
                    <FiLogOut style={{ marginRight: '10px' }} />
                    Disconnect
                  </span>
                </button>
              </div>
            </div>
            )}
          </div>
        ) : (
          <button className="connect-button" onClick={connectWallet}>
            <span className="icon-text">
              <FaWallet style={{ marginRight: '10px' }} />
              Connect Wallet
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
