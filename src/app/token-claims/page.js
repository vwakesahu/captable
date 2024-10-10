"use client";
import React from "react";
import { PageHeader, PageWrapper } from "@/components/pageWrapper";
import GetBalance from "@/components/getBalance";
import { VESTING_CONTRACT_ADDRESS, VESTINGABI } from "@/utils/contracts";
import { useWalletContext } from "@/privy/walletContext";
import { Contract } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <PageHeader>Token Claims</PageHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <BalanceCard />
          <ActionsCard />
        </div>
      </div>
    </PageWrapper>
  );
};

const BalanceCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Wallet className="mr-2" size={20} />
        Your Balance
      </CardTitle>
    </CardHeader>
    <CardContent>
      <GetBalance />
    </CardContent>
  </Card>
);

const ActionsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <RefreshCw className="mr-2" size={20} />
        Actions
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CreateTokenClaim />
    </CardContent>
  </Card>
);

const CreateTokenClaim = () => {
  const { address, signer } = useWalletContext();
  const [isRedeeming, setIsRedeeming] = React.useState(false);

  const redeemAllPlans = async () => {
    setIsRedeeming(true);
    try {
      const vestingContract = new Contract(
        VESTING_CONTRACT_ADDRESS,
        VESTINGABI,
        signer
      );

      const balance = await vestingContract.balanceOf(address);
      console.log("Balance:", balance.toString());

      for (let i = 0; i < balance; i++) {
        const plan = await vestingContract.tokenOfOwnerByIndex(address, i);
        const planDetails = await vestingContract.plans(plan);
        console.log("Plan:", plan.toString());
        console.log("Plan Details:", planDetails);
      }

      const redeemed = await vestingContract.redeemAllPlans();
      console.log("Redemption transaction:", redeemed);
      console.log("Redeemed all plans");
      toast.success("Redeemed all plans successfully");
    } catch (error) {
      toast.error("Error redeeming plans. Please try again.");
      console.error("Error redeeming plans:", error);
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="flex">
      <Button
        variant="default"
        onClick={redeemAllPlans}
        disabled={isRedeeming}
        className="w-auto"
      >
        {isRedeeming ? "Redeeming..." : "Redeem All Plans"}
      </Button>
    </div>
  );
};

export default Page;
