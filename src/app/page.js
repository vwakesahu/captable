import { PageHeader, PageWrapper } from "@/components/pageWrapper";
import React from "react";
import { redirect } from 'next/navigation';

const Page = () => {
  redirect("/vesting-plans");
  return (
    <PageWrapper>
      <PageHeader>Home</PageHeader>
    </PageWrapper>
  );
};

export default Page;
