import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { PiggyBank as Piggy, Diamond, LogOut, Coins } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useWalletContext } from "@/privy/walletContext";
import { ethers } from "ethers";
import { ENCRYPTEDERC20ABI, ERC20_CONTRACT_ADDRESS } from "@/utils/contracts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const menuItems = [
  { icon: Piggy, label: "Vesting Plans", path: "/vesting-plans" },
  { icon: Diamond, label: "Token Claims", path: "/token-claims" },
];

const Sidebar = () => {
  const { logout } = usePrivy();
  const { address, signer } = useWalletContext();
  const pathname = usePathname();
  const [isMinting, setIsMinting] = useState(false);
  const [mintingError, setMintingError] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleMint = async () => {
    setIsMinting(true);
    setMintingError(null);
    try {
      const erc20 = new ethers.Contract(
        ERC20_CONTRACT_ADDRESS,
        ENCRYPTEDERC20ABI,
        signer
      );
      const tx = await erc20.mint(1000);
      await tx.wait();
    } catch (error) {
      console.error("Minting error:", error);
      setMintingError("Failed to mint tokens. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden p-8 fixed md:w-[350px] flex flex-col border-r">
      <div className="flex items-center justify-between">
        <Image
          src="/logo/inco-blue.svg"
          alt="Logo"
          width={123}
          height={33}
          className="cursor-pointer"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          animate="visible"
          className="w-12 h-12 hover:bg-blue-500/5 cursor-pointer border rounded-lg grid place-items-center"
          onClick={handleMint}
          disabled={isMinting}
        >
          {isMinting ? (
            <Coins className="w-6 h-6 text-blue-800 animate-spin" />
          ) : (
            <Coins className="w-6 h-6 text-blue-800" />
          )}
        </motion.div>
      </div>

      <motion.div
        className="mt-8 flex-grow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid gap-3">
          {menuItems.map((item, index) => {
            const isActive = pathname?.startsWith(item.path);
            return (
              <motion.div key={index} variants={itemVariants}>
                <Link href={item.path}>
                  <motion.div
                    className={`flex items-center space-x-3 p-3 px-4 rounded-md cursor-pointer transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 hover:bg-gray-100 hover:text-black hover:font-medium"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-auto"
      >
        <Button
          onClick={logout}
          className="bg-primary w-full flex items-center justify-between"
        >
          <span className="truncate mr-2">{truncateAddress(address)}</span>
          <LogOut className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Sidebar;
