"use client";

import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import {
  PiggyBank as Piggy,
  Coins,
  Building,
  BarChart2,
  Diamond,
  Clock,
  Briefcase,
  ArrowLeftRight,
} from "lucide-react";

const menuItems = [
  { icon: Piggy, label: "Vesting Plans", path: "/vesting-plans" },
  // { icon: Coins, label: "Token Grants", path: "/token-grants" },
  // { icon: Building, label: "Investor Lockups", path: "/investor-lockups" },
  // { icon: BarChart2, label: "Treasury Lockups", path: "/treasury-lockups" },
  { icon: Diamond, label: "Token Claims", path: "/token-claims" },
  // { icon: Clock, label: "Time Locks", path: "/time-locks" },
  // { icon: Briefcase, label: "LP Lockups", path: "/lp-lockups" },
  // { icon: ArrowLeftRight, label: "Treasury Swaps", path: "/treasury-swaps" },
];

const Sidebar = () => {
  const pathname = usePathname();

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

  return (
    <div className="h-screen overflow-hidden p-8 fixed md:w-[350px]">
      <Image
        src="/logo/inco-blue.svg"
        alt="Logo"
        width={123}
        height={33}
        className="cursor-pointer"
      />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button className="mt-8 bg-primary w-full">Connect Wallet</Button>
      </motion.div>

      <motion.div
        className="mt-8"
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
    </div>
  );
};

export default Sidebar;
