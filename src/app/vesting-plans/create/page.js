"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader, PageWrapper } from "@/components/pageWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { VestingPlanSummary } from "@/components/graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  const [unlockFrequency, setUnlockFrequency] = useState("linear");

  const renderUnlockFrequencyContent = () => {
    switch (unlockFrequency) {
      case "linear":
        return (
          <>
            <VestingTermAndCliff />
            <PostVestingLockup />
          </>
        );
      case "periodic":
        return (
          <>
            <UnlockPeriodSchedule />
            <VestingTermAndCliff />
            <PostVestingLockup />
          </>
        );
      case "single":
        return <PostVestingLockup />;
      default:
        return null;
    }
  };

  return (
    <PageWrapper>
      <PageHeader>Create a Vesting Plan</PageHeader>
      <div className="flex flex-col lg:flex-row gap-8 mt-8 pb-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Vesting Plan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProgressSteps currentStep={0} />
            <TokenSelection />
            <UnlockFrequency
              selected={unlockFrequency}
              onSelect={setUnlockFrequency}
            />
            {renderUnlockFrequencyContent()}
            <NavigationButtons />
          </CardContent>
        </Card>
        <div className="w-[30%]">
          <VestingPlanSummary />
        </div>
      </div>
    </PageWrapper>
  );
};

const ProgressSteps = ({ currentStep }) => {
  const steps = ["Setup", "Administration", "Details", "Completed"];
  return (
    <div className="flex justify-between mb-6">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index === currentStep
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`text-sm mt-2 ${
              index === currentStep
                ? "text-blue-500 font-medium"
                : "text-gray-600"
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

const TokenSelection = () => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Token</h2>
    <Input placeholder="Select or paste token contract address" />
  </div>
);

const UnlockFrequency = ({ selected, onSelect }) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Unlock frequency</h2>
    <div className="flex space-x-2">
      {["linear", "periodic", "single"].map((mode) => (
        <Button
          key={mode}
          variant={selected === mode ? "default" : "outline"}
          className={`flex-1 capitalize ${
            selected === mode ? "shadow-sm" : ""
          }`}
          onClick={() => onSelect(mode)}
        >
          {mode}
        </Button>
      ))}
    </div>
  </div>
);

const UnlockPeriodSchedule = () => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Unlock period schedule</h2>
    <Select defaultValue="monthly">
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select schedule" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="monthly">Monthly</SelectItem>
        <SelectItem value="quarterly">Quarterly</SelectItem>
        <SelectItem value="yearly">Yearly</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

const VestingTermAndCliff = () => (
  <div className="flex flex-col md:flex-row gap-4">
    <div className="flex-1 space-y-2">
      <h2 className="text-lg font-semibold">Vesting term</h2>
      <div className="flex space-x-2">
        <Input type="number" defaultValue="3" className="w-20" />
        <Select defaultValue="years">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="years">Years</SelectItem>
            <SelectItem value="months">Months</SelectItem>
            <SelectItem value="days">Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="flex-1 space-y-2">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold">Cliff</h2>
        <Info size={16} className="text-gray-500 cursor-help" />
      </div>
      <div className="flex space-x-2">
        <Input type="number" defaultValue="1" className="w-20" />
        <Select defaultValue="years">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="years">Years</SelectItem>
            <SelectItem value="months">Months</SelectItem>
            <SelectItem value="days">Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

const PostVestingLockup = () => (
  <div className="flex items-center space-x-2">
    <Switch id="post-vesting-lockup" />
    <div>
      <label htmlFor="post-vesting-lockup" className="font-medium">
        Enable post-vesting lockup
      </label>
      <p className="text-sm text-gray-500">
        Adds additional scheduling for fine-grained control over token release
      </p>
    </div>
  </div>
);

const NavigationButtons = () => (
  <div className="flex justify-between pt-4">
    <Button variant="outline">← Back</Button>
    <Button>Next: Administration</Button>
  </div>
);

export default Page;
