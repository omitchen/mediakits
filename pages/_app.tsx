import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/csr/theme-provider";
import { ModeToggle } from "@/components/csr/theme-toggle";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="dark:bg-zinc-950 bg-white text-zinc-950 dark:text-white">
        <div className="fixed top-1 left-1">
          <ModeToggle />
        </div>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
