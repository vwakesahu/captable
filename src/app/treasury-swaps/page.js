import React from "react";
import { PageHeader, PageWrapper } from "@/components/pageWrapper";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <PageWrapper>
      <PageHeader component={<CreateTreasurySwap />}>Treasury Swaps</PageHeader>
      <p className="text-gray-600 mb-8">
        Swap your token with any other address for any other token. You pick the
        parameters and execute it without an escrow.
      </p>
      <div className="text-center mt-16">
        <h2 className="text-xl font-semibold mb-4">
          To see swaps that you have made or are being offered
        </h2>
        <Button size="lg">Connect a wallet</Button>
      </div>
    </PageWrapper>
  );
};

const CreateTreasurySwap = () => (
  <Button variant="secondary">Create Treasury Swap</Button>
);

export default Page;
