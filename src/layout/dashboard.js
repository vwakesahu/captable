"use client";
import Sidebar from "@/components/sidebar";
import { usePrivy } from "@privy-io/react-auth";
import Loader from "@/components/loader";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Dashboard = ({ children }) => {
  const { ready, login, authenticated } = usePrivy();

  const LoginUI = () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Hey!, Welcome Back,</CardTitle>
          <CardDescription>Connect your wallet to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={login}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Connect Wallet
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (!ready) {
    return (
      <div className="h-screen w-full grid place-items-center">
        <Loader />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="h-screen w-full grid place-items-center">
        <LoginUI />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[350px] flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-grow overflow-y-auto">{children}</div>
    </div>
  );
};

export default Dashboard;
