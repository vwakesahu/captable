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
import { Info, Trash2 } from "lucide-react";
import { VestingPlanSummary } from "@/components/graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [unlockFrequency, setUnlockFrequency] = useState("linear");

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <TokenSelection />
            <UnlockFrequency
              selected={unlockFrequency}
              onSelect={setUnlockFrequency}
            />
            {renderUnlockFrequencyContent()}
          </>
        );
      case 1:
        return <AdministrationStep />;
      case 2:
        return <DetailsStep />;
      case 3:
        return <SuccessComponent />;
      default:
        return null;
    }
  };

  const handleStepClick = (stepIndex) => {
    // Only allow moving to completed steps or the next uncompleted step
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      router.push("/vesting-plans");
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

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

  console.log(currentStep);

  return (
    <PageWrapper>
      <PageHeader>Create a Vesting Plan</PageHeader>
      <div className="flex flex-col lg:flex-row gap-8 mt-8 pb-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Vesting Plan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProgressSteps
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
            {renderStepContent()}
            <NavigationButtons
              onNext={handleNext}
              onBack={handleBack}
              currentStep={currentStep}
            />
          </CardContent>
        </Card>
        <div className="w-[40%]">
          <VestingPlanSummary />
        </div>
      </div>
    </PageWrapper>
  );
};

const ProgressSteps = ({ currentStep, onStepClick }) => {
  const steps = ["Setup", "Administration", "Details", "Completed"];

  return (
    <div className="flex justify-between mb-6">
      {steps.map((step, index) => (
        <motion.div
          key={step}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => onStepClick(index)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index === currentStep
                ? "bg-blue-500 text-white"
                : index < currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            initial={false}
            animate={{
              scale: index === currentStep ? 1.1 : 1,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <motion.span
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={index < currentStep ? "check" : "number"}
            >
              {index < currentStep ? "✓" : index + 1}
            </motion.span>
          </motion.div>
          <motion.span
            className={`text-sm mt-2 ${
              index === currentStep
                ? "text-blue-500 font-medium"
                : "text-gray-600"
            }`}
            initial={false}
            animate={{
              fontWeight: index === currentStep ? 600 : 400,
              color: index === currentStep ? "#3B82F6" : "#4B5563",
            }}
          >
            {step}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};

import { Calendar, Upload, Settings, Edit } from "lucide-react";
import SuccessComponent from "@/modules/vesting-plans/success";
import { useRouter } from "next/navigation";

const DetailsStep = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      recipientAddress: "",
      tokenAmount: "",
      vestingStartDate: "",
    },
  ]);

  const handleDuplicate = (planId) => {
    const planToDuplicate = plans.find((plan) => plan.id === planId);
    const newPlan = { ...planToDuplicate, id: plans.length + 1 };
    setPlans([...plans, newPlan]);
  };
  const handleDelete = (planId) => {
    if (plans.length > 1) {
      setPlans(plans.filter((plan) => plan.id !== planId));
    }
  };

  const handleAdd = () => {
    const newPlan = {
      id: plans.length + 1,
      recipientAddress: "",
      tokenAmount: "",
      vestingStartDate: "",
    };
    setPlans([...plans, newPlan]);
  };

  const handleInputChange = (planId, field, value) => {
    setPlans(
      plans.map((plan) =>
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recipients</h2>
        <Button variant="outline" className="flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          Import from CSV
        </Button>
      </div>

      <div className="flex justify-end mb-4">
        <Button variant="link" className="text-blue-500">
          <Settings className="w-4 h-4 mr-2" />
          Advanced settings
        </Button>
      </div>

      {plans.map((plan, index) => (
        <div key={plan.id} className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold mb-4">Plan #{index + 1}</h3>
            {plans.length > 1 && (
              <div
                variant="outline"
                className="text-red-500 border-red-500 cursor-pointer"
                onClick={() => handleDelete(plan.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient address
              </label>
              <div className="relative">
                <Input
                  placeholder="Enter address"
                  className="pr-8"
                  value={plan.recipientAddress}
                  onChange={(e) =>
                    handleInputChange(
                      plan.id,
                      "recipientAddress",
                      e.target.value
                    )
                  }
                />
                <Edit className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount of tokens
              </label>
              <Input
                placeholder="AAVE"
                value={plan.tokenAmount}
                onChange={(e) =>
                  handleInputChange(plan.id, "tokenAmount", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vesting start date
                <Info className="w-4 h-4 inline-block ml-1 text-gray-400" />
              </label>
              <div className="relative">
                <Input
                  placeholder="dd-mm-yyyy"
                  value={plan.vestingStartDate}
                  onChange={(e) =>
                    handleInputChange(
                      plan.id,
                      "vestingStartDate",
                      e.target.value
                    )
                  }
                />
                <Calendar className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex justify-start space-x-2">
            <Button
              variant="outline"
              className="text-green-500 border-green-500"
              onClick={() => handleDuplicate(plan.id)}
            >
              Duplicate
            </Button>
            <Button
              variant="outline"
              className="text-green-500 border-green-500"
              onClick={handleAdd}
            >
              Add
            </Button>
          </div>
        </div>
      ))}
    </motion.div>
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

const AdministrationStep = () => (
  <div className="space-y-6">
    <Governance />
    <AdminFeatures />
  </div>
);

const Governance = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Governance</h2>
    <p className="text-gray-600">
      The tokens locked inside each vesting plan can be used for governance
      voting. For example, Hedgey provides a{" "}
      <a href="#" className="text-blue-500">
        Snapshot Strategy
      </a>{" "}
      that allows holders to vote on proposals. If your token supports it, you
      can also allow on-chain governance to control additional voting parameters
      such as delegation.
    </p>
    <div className="flex items-center space-x-2">
      <Switch id="on-chain-governance" />
      <label htmlFor="on-chain-governance" className="font-medium">
        Allow on-chain governance
      </label>
    </div>
  </div>
);

const AdminFeatures = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Admin features</h2>
    <div>
      <div className="flex justify-between items-center">
        <label className="font-medium">Vesting admin address</label>
        <Button variant="link" className="text-blue-500">
          Change Vesting admin address
        </Button>
      </div>
      <Input
        value="0xc6377415Ee98A7b711161Ee963603eE52fF7750FC"
        readOnly
        className="mt-2 bg-gray-100"
      />
    </div>
    <div className="flex items-center space-x-2">
      <Switch id="admin-transfer" />
      <div>
        <label htmlFor="admin-transfer" className="font-medium">
          Allow admin transfer of plans
        </label>
        <p className="text-sm text-gray-500">
          Allows the admin address to transfer an issued plan to another wallet
          if needed. For example, if a recipient loses access to their wallet
          and needs their plans transferred to a new address, the admin address
          would be able to do this for them.
        </p>
      </div>
    </div>
  </div>
);

const NavigationButtons = ({ onNext, onBack, currentStep }) => {
  const getNextButtonText = () => {
    switch (currentStep) {
      case 0:
        return "Next: Administration";
      case 1:
        return "Next: Details";
      case 2:
        return "Next: Review, Approve and Distribute";
      default:
        return "Finish";
    }
  };
  return (
    <div className="flex justify-between pt-4">
      <Button variant="outline" onClick={onBack} disabled={currentStep === 0}>
        ← Back
      </Button>
      <Button onClick={onNext}>{getNextButtonText()}</Button>
    </div>
  );
};

export default Page;
