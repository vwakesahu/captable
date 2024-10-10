import { Inter } from "next/font/google";
import "./globals.css";
import Dashboard from "@/layout/dashboard";
import PrivyWrapper from "@/privy/privyProvider";
import { FHEWrapper } from "@/fhevm/fheWrapper";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vesting Plans",
  description: "POC for Vesting Plans by INCO",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyWrapper>
          <FHEWrapper>
            <Dashboard>{children}</Dashboard>
            <Toaster />
          </FHEWrapper>
        </PrivyWrapper>
      </body>
    </html>
  );
}
