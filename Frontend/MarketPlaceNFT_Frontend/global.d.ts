// types/global.d.ts
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;

      // BẮT BUỘC có, không optional
      request(args: { method: string; params?: any[] | object }): Promise<any>;
      on(event: 'accountsChanged' | 'chainChanged' | 'disconnect', handler: (...args: any[]) => void): void;
      removeListener(event: string, handler: (...args: any[]) => void): void;
      removeAllListeners?: (...args: any[]) => void;

      [key: string]: any;

      providers?: any[];
      selectedAddress?: string;
      chainId?: string;
      networkVersion?: string;
    };
  }
}

export { };