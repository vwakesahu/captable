'use client'
import React from "react";
import { PageHeader, PageWrapper } from "@/components/pageWrapper";
import CreateVestingPlans from "@/modules/vesting-plans/createVestingPlans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import GetBalance from "@/components/getBalance";

const Page = () => {
  return (
    <PageWrapper>
      <PageHeader component={<div className='flex items-center gap-3'><GetBalance /> <CreateVestingPlans /></div>}>Vesting Plans</PageHeader>
      <p className="text-gray-600 mb-8">
        Vesting plans designed for employees and contributors to vest their
        revocable token grants linearly over time.
      </p>
      <IssuedVestingPlans />
      <ReceivedVestingPlans />
    </PageWrapper>
  );
};

const IssuedVestingPlans = () => (
  <div>
    <div className="flex flex-row items-center justify-between">
      <div className="text-xl font-semibold leading-none tracking-tight my-3">
        Issued Vesting Plans
      </div>
      <ViewOnSafeButton />
    </div>
    <Card className="mb-8 mt-2">
      <NotConnectedMessage />
    </Card>
  </div>
);

const ReceivedVestingPlans = () => (
  <div>
    <div className="flex flex-row items-center justify-between">
      <div className="text-xl font-semibold leading-none tracking-tight my-3">
        Received Vesting Plans
      </div>
      <ViewOnSafeButton />
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
    <p className="text-gray-700 font-semibold">You&#39;re not connected yet...</p>
    <Button
      variant="link"
      className="text-blue-500 hover:text-blue-700 p-0 text-[16px]"
    >
      Connect a wallet
    </Button>
    <span className="text-gray-600">&nbsp;to see your Vesting Plans</span>
  </div>
);

export default Page;
