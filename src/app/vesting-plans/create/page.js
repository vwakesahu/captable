"use client";
import React, { useState } from "react";
import { Contract, ethers } from "ethers";
import { PageHeader, PageWrapper } from "@/components/pageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [tokenAddress, setTokenAddress] = useState(ERC20_CONTRACT_ADDRESS);
  const [beneficiary, setBeneficiary] = useState(
    "0xc6377415ee98a7b71161ee963603ee52ff7750fc"
  );
  const [amount, setAmount] = useState("100");
  const [cliff, setCliff] = useState("200");
  const [rate, setRate] = useState("10");
  const [period, setPeriod] = useState("1");
  const { signer, address } = useWalletContext();
  const { instance: fhevmInstance } = useFhevm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStepClick = (stepIndex) => {
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const getCurrentBlockTimestamp = async () => {
    const latestBlock = await signer.provider.getBlock("latest");
    const currentTimestamp = latestBlock.timestamp;
    const timestampNumber = Number(currentTimestamp);

    if (isNaN(timestampNumber) || !Number.isSafeInteger(timestampNumber)) {
      throw new Error(
        "Timestamp conversion error or value out of safe integer range"
      );
    }

    return timestampNumber;
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      await createVestingPlan();
      setCurrentStep((prevStep) => prevStep + 1);
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const createVestingPlan = async () => {
    setIsLoading(true);
    setError("");
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
      console.log("Parsed amount:", parsedAmount.toString());

      await approveVestingContract(
        erc20,
        VESTING_CONTRACT_ADDRESS,
        parsedAmount
      );

      const VestingInput = await fhevmInstance.createEncryptedInput(
        VESTING_CONTRACT_ADDRESS,
        address
      );

      const scaledAmount = Number(
        ethers.utils.formatUnits(parsedAmount, "ether")
      );

      const blockTimestamp = await getCurrentBlockTimestamp();
      VestingInput.add64(scaledAmount)
        .add64(blockTimestamp)
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
      // Show success message or redirect
    } catch (error) {
      console.error("Error creating vesting plan:", error);
      setError("Failed to create vesting plan. Please try again.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const approveVestingContract = async (
    erc20Contract,
    vestingAddress,
    amount
  ) => {
    const input = fhevmInstance.createEncryptedInput(tokenAddress, address);
    const scaledAmount = Number(ethers.utils.formatUnits(amount, "ether"));
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
          <TokenSelection
            tokenAddress={tokenAddress}
            setTokenAddress={setTokenAddress}
          />
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
            <CliffInput cliff={cliff} setCliff={setCliff} />
            <RateInput rate={rate} setRate={setRate} />
            <PeriodInput period={period} setPeriod={setPeriod} />
          </>
        );
      case 3:
        return (
          <>
            <CongratulationsStep />
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
            <div className="space-y-4 px-1">{renderStepContent()}</div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <NavigationButtons
              onNext={handleNext}
              onBack={handleBack}
              currentStep={currentStep}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
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
    <h2 className="text-lg font-semibold">Period (in seconds)</h2>
    <Input
      type="number"
      placeholder="Enter release period in seconds"
      value={period}
      onChange={(e) => setPeriod(e.target.value)}
    />
  </div>
);

const NavigationButtons = ({ onNext, onBack, currentStep, isLoading }) => {
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
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 0 || isLoading}
      >
        ← Back
      </Button>
      <Button onClick={onNext} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          getNextButtonText()
        )}
      </Button>
    </div>
  );
};

export default Page;

const CongratulationsStep = () => {
  const router = useRouter();

  return (
    <div className="text-center space-y-6 py-8">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
      <h2 className="text-3xl font-bold text-gray-800">Congratulations!</h2>
      <p className="text-xl text-gray-600">
        Your vesting plan has been created successfully.
      </p>
      <Button
        onClick={() => router.push("/vesting-plans")}
        className="mt-6 px-6 py-3 text-lg"
      >
        View Vesting Plans
      </Button>
    </div>
  );
};
