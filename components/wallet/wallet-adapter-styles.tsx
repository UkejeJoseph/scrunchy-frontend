'use client';

import { useEffect } from 'react';

// Component to load wallet adapter CSS dynamically
export function WalletAdapterStyles() {
  useEffect(() => {
    // Check if styles already loaded
    if (document.getElementById('wallet-adapter-styles')) return;

    // Load wallet adapter CSS
    const link = document.createElement('link');
    link.id = 'wallet-adapter-styles';
    link.rel = 'stylesheet';
    link.href = '/node_modules/@solana/wallet-adapter-react-ui/styles.css';
    
    link.onerror = () => {
      // If file doesn't exist, create inline styles instead
      const style = document.createElement('style');
      style.id = 'wallet-adapter-styles';
      style.textContent = `
        .wallet-adapter-button {
          background-color: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 16px;
          font-weight: 600;
          height: 37px;
          line-height: 1;
          padding: 0 16px;
        }
        .wallet-adapter-button:hover:not([disabled]) {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .wallet-adapter-button[disabled] {
          background: #404144;
          color: #999;
          cursor: not-allowed;
        }
      `;
      document.head.appendChild(style);
    };
    
    document.head.appendChild(link);
  }, []);

  return null;
}

