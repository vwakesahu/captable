import { useFhevm } from "@/fhevm/fhevm-context";
import { useWalletContext } from "@/privy/walletContext";
import {
  ERC20_CONTRACT_ADDRESS,
  VESTING_CONTRACT_ADDRESS,
  VESTINGABI,
} from "@/utils/contracts";
import { Contract } from "ethers";
import { Button } from "./ui/button";

const RedeemPlans = () => {
  const { w0, signer, address } = useWalletContext();
  const { instance: fhevmInstance } = useFhevm();

  const getAllPlans = async () => {
    const vestingContract = new Contract(
      VESTING_CONTRACT_ADDRESS,
      VESTINGABI,
      signer
    );
    const plans = await vestingContract.plans(1);
    console.log(plans);

    const redeemTx = await vestingContract.redeemAllPlans();
    await redeemTx.wait();

    const erc20 = new Contract(tokenAddress, ENCRYPTEDERC20ABI, signer);

    const balanceHandle = await erc20.balanceOf(address);
    console.log(balanceHandle.toString());

    const { publicKey, privateKey } = fhevmInstance.generateKeypair();
    const eip712Bob = fhevmInstance.createEIP712(publicKey, address);
    const signature = await signer._signTypedData(
      eip712Bob.domain,
      { Reencrypt: eip712Bob.types.Reencrypt },
      eip712Bob.message
    );

    const balanceBob = await fhevmInstance.reencrypt(
      balanceHandle,
      privateKey,
      publicKey,
      signature.replace("0x", ""),
      ERC20_CONTRACT_ADDRESS,
      address
    );

    console.log(balanceBob);
  };
  return <Button onClick={getAllPlans}>RedeemPlans</Button>;
};

export default RedeemPlans;
