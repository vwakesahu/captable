"use client";
import React, { useState, useEffect } from "react";
import { Contract, ethers } from "ethers";
import { PageHeader, PageWrapper } from "@/components/pageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VestingPlanSummary } from "@/components/graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ProgressSteps } from "@/modules/vesting-plans/progress";
import { useWalletContext } from "@/privy/walletContext";
import {
  ENCRYPTEDERC20ABI,
  ERC20_CONTRACT_ADDRESS,
  VESTING_CONTRACT_ADDRESS,
  VESTINGABI,
} from "@/utils/contracts";
import { useFhevm } from "@/fhevm/fhevm-context";

// Import ABIs (you'll need to create these based on your contract)
// import CTokenVestingPlansABI from "./abis/CTokenVestingPlans.json";
// import EncryptedERC20ABI from "./abis/EncryptedERC20.json";

const Page = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [vestingContract, setVestingContract] = useState(null);
  const [erc20Contract, setERC20Contract] = useState(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const { w0, signer, address } = useWalletContext();
  const { instance: fhevmInstance } = useFhevm();

  const handleStepClick = (stepIndex) => {
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      await createVestingPlan();
      // router.push("/vesting-plans");
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const createVestingPlan = async () => {
    console.log(tokenAddress, beneficiary, amount, duration);

    const vestingContract = new Contract(
      VESTING_CONTRACT_ADDRESS,
      VESTINGABI,
      signer
    );
    // if (!tokenAddress || !beneficiary || !amount || !duration) {
    //   console.error("Missing required fields");
    //   return;
    // }

    try {
      const erc20 = new ethers.Contract(
        tokenAddress,
        ENCRYPTEDERC20ABI,
        signer
      );

      // Approve vesting contract
      await approveVestingContract(
        erc20,
        VESTING_CONTRACT_ADDRESS,
        ethers.utils.parseEther("100")
      );

      const VestingInput = fhevmInstance.createEncryptedInput(
        VESTING_CONTRACT_ADDRESS,
        address
      );

      VestingInput.add64(100000).add64(0).add64(200); //1. amount, 2. start: block.timestamp, 3. cliff
      const VestingOutput = VestingInput.encrypt();

      const createTx = await vestingContract.createPlan(
        "0xc6377415ee98a7b71161ee963603ee52ff7750fc", //  beneficiary,
        ERC20_CONTRACT_ADDRESS,
        VestingOutput.handles[0],
        VestingOutput.handles[1],
        VestingOutput.handles[2],
        10, // rate: no. of tokens realeased per second
        1, // period 1 = 1 second
        VestingOutput.inputProof
      );
      await createTx.wait();
      console.log("Vesting plan created successfully");
    } catch (error) {
      console.error("Error creating vesting plan:", error);
    }
  };

  const approveVestingContract = async (vestingAddress, amount) => {
    const input = fhevmInstance.createEncryptedInput(
      ERC20_CONTRACT_ADDRESS,
      address
    );
    input.add64(100000);
    const encryptedAllowanceAmount = input.encrypt();

    const erc20Contract = new Contract(
      ERC20_CONTRACT_ADDRESS,
      ENCRYPTEDERC20ABI,
      signer
    );

    console.log(erc20Contract);

    const tx = await erc20Contract["approve(address,bytes32,bytes)"](
      VESTING_CONTRACT_ADDRESS,
      encryptedAllowanceAmount.handles[0],
      encryptedAllowanceAmount.inputProof
    );
    await tx.wait();
    console.log(`Approved ${amount} tokens for vesting contract`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <TokenSelection
              tokenAddress={tokenAddress}
              setTokenAddress={setTokenAddress}
            />
          </>
        );
      case 1:
        return (
          <>
            <BeneficiaryInput
              beneficiary={beneficiary}
              setBeneficiary={setBeneficiary}
            />
            <AmountInput amount={amount} setAmount={setAmount} />
          </>
        );
      case 2:
        return (
          <>
            <DurationInput duration={duration} setDuration={setDuration} />
          </>
        );
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
            <ProgressSteps
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
            <div className="space-y-4 max-h-[350px] overflow-auto">
              {renderStepContent()}
            </div>

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

const TokenSelection = ({ tokenAddress, setTokenAddress }) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Token</h2>
    <Input
      placeholder="Paste token contract address"
      value={tokenAddress}
      onChange={(e) => setTokenAddress(e.target.value)}
    />
  </div>
);

const BeneficiaryInput = ({ beneficiary, setBeneficiary }) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Beneficiary Address</h2>
    <Input
      placeholder="Enter beneficiary address"
      value={beneficiary}
      onChange={(e) => setBeneficiary(e.target.value)}
    />
  </div>
);

const AmountInput = ({ amount, setAmount }) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Amount</h2>
    <Input
      type="number"
      placeholder="Enter token amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />
  </div>
);

const DurationInput = ({ duration, setDuration }) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Vesting Duration (in seconds)</h2>
    <Input
      type="number"
      placeholder="Enter vesting duration in seconds"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
    />
  </div>
);

const NavigationButtons = ({ onNext, onBack, currentStep }) => {
  const getNextButtonText = () => {
    switch (currentStep) {
      case 0:
        return "Next: Beneficiary & Amount";
      case 1:
        return "Next: Duration";
      case 2:
        return "Create Vesting Plan";
      default:
        return "Next";
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
