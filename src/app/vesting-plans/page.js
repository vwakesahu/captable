import React from "react";
import { PageHeader, PageWrapper } from "@/components/pageWrapper";
import CreateVestingPlans from "@/modules/vesting-plans/createVestingPlans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

const Page = () => {
  return (
    <PageWrapper>
      <PageHeader component={<CreateVestingPlans />}>Vesting Plans</PageHeader>
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
  <Card className="mb-8">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Issued Vesting Plans</CardTitle>
      <ViewOnSafeButton />
    </CardHeader>
    <CardContent>
      <NotConnectedMessage />
    </CardContent>
  </Card>
);

const ReceivedVestingPlans = () => (
  <Card className="mb-8">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Received Vesting Plans</CardTitle>
      <ViewOnSafeButton />
    </CardHeader>
    <CardContent>
      <NotConnectedMessage />
    </CardContent>
  </Card>
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
    <p className="text-gray-700 font-semibold">You're not connected yet...</p>
    <Button variant="link" className="text-blue-500 hover:text-blue-700 p-0 text-[16px]">
      Connect a wallet
    </Button>
    <span className="text-gray-600">&nbsp;to see your Vesting Plans</span>
  </div>
);

export default Page;
