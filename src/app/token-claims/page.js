"use client";
import React from "react";
import { PageHeader, PageWrapper } from "@/components/pageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import RedeemPlans from "@/components/redeemPlans";
import GetBalance from "@/components/getBalance";
import { VESTING_CONTRACT_ADDRESS, VESTINGABI } from "@/utils/contracts";
import { useWalletContext } from "@/privy/walletContext";
import { Contract } from "ethers";

const Page = () => {
  return (
    <PageWrapper>
      <PageHeader
        component={
          <div className="flex items-center gap-3">
            <GetBalance />
            <CreateTokenClaim />
            {/* <RedeemPlans /> */}
          </div>
        }
      >
        Token Claims
      </PageHeader>
      <p className="text-gray-600 mb-8">
        Give your community a custom page to claim tokens with options for
        locking and revocability.
      </p>
      <CreatedTokenClaims />
    </PageWrapper>
  );
};

const CreateTokenClaim = () => {
  const { address, signer } = useWalletContext();
  const redeemAllPlans = async () => {
    const vestingContract = new Contract(
      VESTING_CONTRACT_ADDRESS,
      VESTINGABI,
      signer
    );

    const balance = await vestingContract.balanceOf(address);
    console.log(balance.toString());

    for (let i = 0; i < balance; i++) {
      const plan = await vestingContract.tokenOfOwnerByIndex(address, i);
      const planDetails = await vestingContract.plans(1);
      console.log(plan);
      console.log(planDetails);
    }

    const redemeed = await vestingContract.redeemAllPlans();
    console.log(redemeed);
    console.log("Redeemed all plans");
  };
  return (
    <Button variant="secondary" onClick={redeemAllPlans}>
      Redeem All Plans
    </Button>
  );
};

const CreatedTokenClaims = () => (
  <div>
    <div className="flex flex-row items-center justify-between">
      <div className="text-xl font-semibold leading-none tracking-tight my-3">
        Created Token Claims
      </div>
      {/* <ViewOnSafeButton /> */}
    </div>
    <Card className="mb-8 mt-2">
      <NotConnectedMessage />
    </Card>
  </div>
);

const ViewOnSafeButton = () => (
  <Button
    variant="outline"
    size="sm"
    className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
  >
    <Eye className="mr-2 h-4 w-4" /> View on Safe
  </Button>
);

const NotConnectedMessage = () => (
  <div className="text-center py-8 leading-3">
    <p className="text-gray-700 font-semibold">
      You&#39;re not connected yet...
    </p>
    <Button
      variant="link"
      className="text-blue-500 hover:text-blue-700 p-0 text-[16px]"
    >
      Connect a wallet
    </Button>
    <span className="text-gray-600"> to see your Token Claims</span>
  </div>
);

export default Page;
