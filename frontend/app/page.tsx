'use client'
import { useState } from 'react';
import { ethers } from 'ethers';
import WalletProvider from '../components/WalletProvider';

export default function Page() {
  const [loading, setLoading] = useState(false);

  const sendTransaction = async () => {
    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: '0xRecipientAddressHere', // replace with actual recipient
        value: ethers.parseEther('0.01')
      });

      await tx.wait(); // eth transaction confirmation
      alert('Transaction sent 🚀');
    } catch (e) {
      console.error(e);
      alert('Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WalletProvider>
      <button onClick={sendTransaction} disabled={loading}>
        {loading ? 'Sending...' : 'Send 0.01 ETH'}
      </button>
    </WalletProvider>
  );
    }
