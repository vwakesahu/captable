import React from "react";
import { PageHeader, PageWrapper } from "@/components/pageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";

const Page = () => {
  return (
    <PageWrapper>
      <PageHeader component={<CreateTokenClaim />}>Token Claims</PageHeader>
      <p className="text-gray-600 mb-8">
        Give your community a custom page to claim tokens with options for
        locking and revocability.
      </p>
      <CreatedTokenClaims />
    </PageWrapper>
  );
};

const CreateTokenClaim = () => (
  <Button variant="secondary">Create a Token Claim</Button>
);

const CreatedTokenClaims = () => (
  <div>
    <div className="flex flex-row items-center justify-between">
      <div className="text-xl font-semibold leading-none tracking-tight my-3">
        Created Token Claims
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
    <span className="text-gray-600"> to see your Token Claims</span>
  </div>
);

export default Page;
