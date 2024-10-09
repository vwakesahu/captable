"use client";
import React, { useState } from "react";
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

const Page = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [tokenAddress, setTokenAddress] = useState(ERC20_CONTRACT_ADDRESS);
  const [beneficiary, setBeneficiary] = useState(
    "0xc6377415ee98a7b71161ee963603ee52ff7750fc"
  );
  const [amount, setAmount] = useState("100");
  const [duration, setDuration] = useState("");
  const [cliff, setCliff] = useState("200");
  const [rate, setRate] = useState("10");
  const [period, setPeriod] = useState("1");
  const { signer, address } = useWalletContext();
  const { instance: fhevmInstance } = useFhevm();

  const handleStepClick = (stepIndex) => {
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const getCurrentBlockTimestamp = async () => {
    const latestBlock = await signer.provider.getBlock("latest");
    const currentTimestamp = latestBlock.timestamp;

    // Convert BigInt to Number
    const timestampNumber = Number(currentTimestamp);

    console.log("Original timestamp (BigInt):", currentTimestamp.toString());
    console.log("Converted timestamp (Number):", timestampNumber);

    // Check if conversion was successful and value is safe
    if (isNaN(timestampNumber) || !Number.isSafeInteger(timestampNumber)) {
      throw new Error(
        "Timestamp conversion error or value out of safe integer range"
      );
    }

    console.log(typeof timestampNumber);

    return timestampNumber;
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      // getCurrentBlockTimestamp();
      await createVestingPlan();
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const createVestingPlan = async () => {
    try {
      const vestingContract = new Contract(
        VESTING_CONTRACT_ADDRESS,
        VESTINGABI,
        signer
      );

      const erc20 = new ethers.Contract(
        tokenAddress,
        ENCRYPTEDERC20ABI,
        signer
      );

      const parsedAmount = ethers.utils.parseEther(amount);

      await approveVestingContract(
        erc20,
        VESTING_CONTRACT_ADDRESS,
        parsedAmount
      );

      const VestingInput = fhevmInstance.createEncryptedInput(
        VESTING_CONTRACT_ADDRESS,
        address
      );

      // Convert parsedAmount to a regular number that fits within 64 bits
      const scaledAmount = Number(
        ethers.utils.formatUnits(parsedAmount, "ether")
      );

      const blockTimestamp = await getCurrentBlockTimestamp();
      VestingInput.add64(scaledAmount)
        .add64(blockTimestamp) // start: block.timestamp
        .add64(Number(cliff));
      const VestingOutput = VestingInput.encrypt();

      const createTx = await vestingContract.createPlan(
        beneficiary,
        tokenAddress,
        VestingOutput.handles[0],
        VestingOutput.handles[1],
        VestingOutput.handles[2],
        Number(rate),
        Number(period),
        VestingOutput.inputProof
      );
      await createTx.wait();
      console.log("Vesting plan created successfully");
    } catch (error) {
      console.error("Error creating vesting plan:", error);
    }
  };

  const approveVestingContract = async (
    erc20Contract,
    vestingAddress,
    amount
  ) => {
    const input = fhevmInstance.createEncryptedInput(tokenAddress, address);
    console.log("Amount to approve:", amount.toString());

    // Convert the BigNumber to a regular number, scaling it down if necessary
    const scaledAmount = Number(ethers.utils.formatUnits(amount, "ether"));
    console.log("Scaled amount:", scaledAmount);

    input.add64(scaledAmount);
    const encryptedAllowanceAmount = input.encrypt();

    const tx = await erc20Contract["approve(address,bytes32,bytes)"](
      vestingAddress,
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
            <CliffInput cliff={cliff} setCliff={setCliff} />
            <RateInput rate={rate} setRate={setRate} />
            <PeriodInput period={period} setPeriod={setPeriod} />
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

const CliffInput = ({ cliff, setCliff }) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Cliff (in seconds)</h2>
    <Input
      type="number"
      placeholder="Enter cliff duration in seconds"
      value={cliff}
      onChange={(e) => setCliff(e.target.value)}
    />
  </div>
);

const RateInput = ({ rate, setRate }) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Release Rate (tokens per second)</h2>
    <Input
      type="number"
      placeholder="Enter release rate"
      value={rate}
      onChange={(e) => setRate(e.target.value)}
    />
  </div>
);

const PeriodInput = ({ period, setPeriod }) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Release Period (in seconds)</h2>
    <Input
      type="number"
      placeholder="Enter release period in seconds"
      value={period}
      onChange={(e) => setPeriod(e.target.value)}
    />
  </div>
);

const NavigationButtons = ({ onNext, onBack, currentStep }) => {
  const getNextButtonText = () => {
    switch (currentStep) {
      case 0:
        return "Next: Beneficiary & Amount";
      case 1:
        return "Next: Duration & Details";
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
