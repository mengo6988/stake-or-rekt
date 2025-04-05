import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider, darkTheme, midnightTheme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/config/wagmi";
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
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider theme={midnightTheme()}>
          <main className={`${kanit.variable}`}>
            <Component {...pageProps} />
          </main>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}