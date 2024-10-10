import React, { useState } from "react";
import { useFhevm } from "@/fhevm/fhevm-context";
import { useWalletContext } from "@/privy/walletContext";
import {
  ENCRYPTEDERC20ABI,
  ERC20_CONTRACT_ADDRESS,
  VESTING_CONTRACT_ADDRESS,
  VESTINGABI,
} from "@/utils/contracts";
import { Contract } from "ethers";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Assuming you have an ERC20 ABI defined somewhere in your project
// import { erc20abi } from "@/utils/abis";

const GetBalance = () => {
  const { signer, address } = useWalletContext();
  const { instance: fhevmInstance } = useFhevm();
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const getBalance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { publicKey, privateKey } = fhevmInstance.generateKeypair();
      const eip712 = fhevmInstance.createEIP712(
        publicKey,
        ERC20_CONTRACT_ADDRESS
      );

      const signature = await signer._signTypedData(
        eip712.domain,
        { Reencrypt: eip712.types.Reencrypt },
        eip712.message
      );
      const erc20Contract = new Contract(
        ERC20_CONTRACT_ADDRESS,
        ENCRYPTEDERC20ABI,
        signer
      );
      const balanceHandle = await erc20Contract.balanceOf(address);
      console.log("balanceHandle", balanceHandle);
      if (balanceHandle.toString() === "0") {
        toast.error("You have no balance to fetch.");
        setBalance(null);
      } else {
        const balanceResult = await fhevmInstance.reencrypt(
          balanceHandle.toHexString().replace("0x", ""),
          privateKey,
          publicKey,
          signature.replace("0x", ""),
          ERC20_CONTRACT_ADDRESS,
          address
        );
        console.log(balanceResult);
        const vestingContract = new Contract(
          VESTING_CONTRACT_ADDRESS,
          VESTINGABI,
          signer
        );
        const plans = await vestingContract.plans(1);
        console.log(plans);
        setBalance(balanceResult.toString());
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch balance. Please try again.");
      setError("Failed to fetch balance. Please try again.");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };
  const showPlans = async () => {
    const vestingContract = new Contract(
      VESTING_CONTRACT_ADDRESS,
      VESTINGABI,
      signer
    );

    const balance = await vestingContract.balanceOf(address);
    console.log(balance.toString());

    for (let i = 0; i < balance.toNumber(); i++) {
      const plan = await vestingContract.tokenOfOwnerByIndex(address, i);
      const planDetails = await vestingContract.plans(1);
      console.log(plan);
      console.log(planDetails);
    }

    const redemeed = await vestingContract.redeemAllPlans();
    console.log(redemeed);
  };

  return (
    <div className="space-y-4">
      <Button onClick={getBalance} disabled={isLoading}>
        {isLoading
          ? "Loading..."
          : balance
          ? `Your Balance : ${balance}`
          : "Get balance"}
      </Button>
    </div>
  );
};

export default GetBalance;
