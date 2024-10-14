import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/csr/theme-provider";

import { initFirebase } from "@/utils/firebase";
import { useEffect } from "react";
import Navbar from "@/components/csr/navbar";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initFirebase();
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="dark:bg-zinc-950 bg-white text-zinc-950 dark:text-white">
        <div className="fixed top-1 left-1">
          <Navbar />
        </div>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
