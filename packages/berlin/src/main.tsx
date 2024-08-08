// React and third-party libraries
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SIWEProvider, SIWEConfig, ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { SiweMessage } from 'siwe';
import { logout, postSIWEVerify, fetchSIWENonce, fetchSIWESession } from 'api';
import BerlinApp from './App.tsx';
import ThemedApp from './global.styled';
import './index.css';
import { createConfig, WagmiProvider } from 'wagmi';
import { mainnet } from 'viem/chains';

const queryClient = new QueryClient();

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet],
    // Required API Keys
    walletConnectProjectId: '594124f166e0bcd3bdee74cfaf90b750',
    // Required App Info
    appName: 'Pluraltools',
    // Optional App Info
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const siweConfig: SIWEConfig = {
  createMessage: ({ nonce, address, chainId }) =>
    new SiweMessage({
      version: '1',
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      // Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
      statement: 'Sign in With Ethereum.',
    }).prepareMessage(),
  getNonce: async () =>
    fetchSIWENonce({ serverUrl: import.meta.env.VITE_SERVER_URL }).then((nonce) => nonce ?? ''),
  verifyMessage: async ({ message, signature }) =>
    postSIWEVerify({
      serverUrl: import.meta.env.VITE_SERVER_URL,
      message,
      signature,
    }).then((res) => !!res),
  getSession: async () =>
    fetchSIWESession({ serverUrl: import.meta.env.VITE_SERVER_URL }).then((session) => ({
      address: session?.address as `0x${string}`,
      chainId: isNaN(Number(session?.chainId)) ? 0 : Number(session?.chainId),
    })),
  signOut: async () =>
    logout({
      serverUrl: import.meta.env.VITE_SERVER_URL,
    }).then((res) => res.ok),
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider>
            <ThemedApp>
              <BerlinApp queryClient={queryClient} />
            </ThemedApp>
          </ConnectKitProvider>
        </SIWEProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
