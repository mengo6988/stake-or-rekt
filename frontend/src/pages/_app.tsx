import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { config } from "@/config/wagmi";
// import Layout from "@/layout/Layout";
import {
  baseSepolia,
  flowTestnet,
} from "wagmi/chains";
import { WagmiProvider } from "@privy-io/wagmi";
// import { localBase } from "@/config/chains";
import { config } from "@/config/wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { Kanit } from 'next/font/google';

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-kanit'
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Customize Privy's appearance in your app
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia, flowTestnet],
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
          logo: "/foresightLogo.jpg",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "all-users",
          showWalletUIs: true,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {/* <RainbowKitProvider theme={darkTheme()}> */}
          <SmartWalletsProvider>
          <main className={`${kanit.variable}`}>
            <Component {...pageProps} />
            </main>
          {/* </Layout> */}
          </SmartWalletsProvider>
      </WagmiProvider>
    </QueryClientProvider>

    </PrivyProvider>
  );
}
