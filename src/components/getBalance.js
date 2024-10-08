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
      console.log(balanceHandle.toString());
    //   setBalance(balanceHandle.toString());
      const balanceResult = await fhevmInstance.reencrypt(
        balanceHandle,
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
    } catch (err) {
      console.error(err);
      setError("Failed to fetch balance. Please try again.");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={getBalance} disabled={isLoading}>
        {isLoading ? "Loading..." : "Get balance"}
      </Button>
      {balance !== null && (
        <Alert variant="outline">
          <AlertDescription>Your balance: {balance}</AlertDescription>
        </Alert>
      )}
      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{error}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={closeErrorModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetBalance;
