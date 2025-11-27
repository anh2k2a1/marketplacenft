// src/contexts/ConnectProvider.tsx
import React from 'react';
import { AutoConnectProvider } from './AutoConnectProvider';
import { NetworkConfigurationProvider } from './NetworkConfigurationProvider';

const ConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AutoConnectProvider>
      <NetworkConfigurationProvider>
        {children}
      </NetworkConfigurationProvider>
    </AutoConnectProvider>
  );
};

export default ConnectProvider; // BẮT BUỘC CÓ DÒNG NÀY