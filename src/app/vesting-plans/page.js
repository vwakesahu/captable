"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { PageHeader, PageWrapper } from "@/components/pageWrapper";
import CreateVestingPlans from "@/modules/vesting-plans/createVestingPlans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, DollarSign, Clock, Calendar } from "lucide-react";
import GetBalance from "@/components/getBalance";
import { usePrivy } from "@privy-io/react-auth";
import { VESTING_CONTRACT_ADDRESS, VESTINGABI } from "@/utils/contracts";
import { useWalletContext } from "@/privy/walletContext";

const Page = () => {
  return (
    <PageWrapper>
      <PageHeader
        component={
          <div className="flex items-center gap-3">
            <GetBalance /> <CreateVestingPlans />
          </div>
        }
      >
        Vesting Plans
      </PageHeader>
      {/* <p className="text-gray-600 mb-8">
      Vesting plans designed for employees and contributors to vest their
      revocable token grants linearly over time.
    </p> */}
      <VestingPlans />
    </PageWrapper>
  );
};

const VestingPlans = () => {
  const [vestingPlans, setVestingPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authenticated: isConnected } = usePrivy();
  const { address, signer } = useWalletContext();

  useEffect(() => {
    if (isConnected) {
      fetchVestingPlans();
    }
  }, [isConnected, address]);

  const fetchVestingPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const vestingContract = new ethers.Contract(
        VESTING_CONTRACT_ADDRESS,
        VESTINGABI,
        signer
      );

      const balance = await vestingContract.balanceOf(address);
      const plans = [];
      console.log(typeof balance);

      for (let i = 0; i < balance; i++) {
        const planId = await vestingContract.tokenOfOwnerByIndex(address, i);
        const planDetails = await vestingContract.plans(planId);
        plans.push({ id: planId.toString(), ...planDetails });
      }

      setVestingPlans(plans);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between mb-6">
        {/* <div className="text-2xl font-bold">Your Vesting Plans</div> */}
        {/* <ViewOnSafeButton /> */}
      </div>

      {isConnected ? (
        isLoading ? (
          <Card className="mb-8">
            <CardContent className="text-center py-8">
              <div className="animate-pulse">Loading vesting plans...</div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="mb-8">
            <CardContent className="text-center py-8 text-red-500">
              Error: {error}
            </CardContent>
          </Card>
        ) : (
          <>
            <VestingPlansSummary plans={vestingPlans} />
            <VestingPlansTable plans={vestingPlans} />
          </>
        )
      ) : (
        <Card className="mb-8">
          <NotConnectedMessage />
        </Card>
      )}
    </div>
  );
};

const VestingPlansSummary = ({ plans }) => {
  const calculateAverageDuration = (plans) => {
    console.log(plans);
    const plansPeriosArray = plans.map((plan) => plan["5"]);
    console.log(plansPeriosArray);
    const sum = plansPeriosArray
      .map((period) => parseInt(period))
      .reduce((a, b) => a + b, 0);

    return sum / plansPeriosArray.length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="flex items-center p-6">
          <Clock className="w-8 h-8 mr-4 text-primary" />
          <div>
            <p className="text-sm text-gray-500">Average Vesting Period</p>
            <p className="text-xl font-bold">
              {calculateAverageDuration(plans)}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center p-6">
          <Calendar className="w-8 h-8 mr-4 text-primary" />
          <div>
            <p className="text-sm text-gray-500">Active Plans</p>
            <p className="text-xl font-bold">{plans.length}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const VestingPlansTable = ({ plans }) => (
  <Card>
    <CardHeader>
      <CardTitle>Vesting Plan Details</CardTitle>
    </CardHeader>
    <CardContent>
      {plans.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Cliff</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Period</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {safeFormatBigNumber(plan["1"]).slice(1, 6) + "..."}
                </TableCell>
                <TableCell>
                  {safeFormatDuration(plan["3"]).slice(1, 6) + "..."}
                </TableCell>
                <TableCell>{safeFormatRate(plan["4"])} tokens/sec</TableCell>
                <TableCell>{safeFormatDuration(plan["5"])} sec</TableCell>
                {/* <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" /> View
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyPlansMessage />
      )}
    </CardContent>
  </Card>
);

const EmptyPlansMessage = () => (
  <div className="text-center py-8">
    <p className="text-gray-700 mb-4 font-semibold">No Vesting Plans Found.</p>
    <CreateVestingPlans button="default" />
  </div>
);

const NotConnectedMessage = () => (
  <div className="text-center py-8 leading-3">
    <p className="text-gray-700 font-semibold">
      You&#39;re not connected yet...
    </p>
    <Button
      variant="link"
      className="text-blue-500 hover:text-blue-700 p-0 text-[16px]"
    >
      Connect a wallet
    </Button>
    <span className="text-gray-600">&nbsp;to see your Vesting Plans</span>
  </div>
);

// Safe helper functions to format BigNumber values
const safeFormatBigNumber = (value, decimals = 18) => {
  if (!value) return "N/A";
  try {
    console.log(value);
    return value.toString();
    // return ethers.utils.formatUnits(value, decimals);
  } catch (error) {
    console.error("Error formatting BigNumber:", error);
    return "Error";
  }
};

const safeFormatDuration = (duration) => {
  if (!duration) return "N/A";
  try {
    return `${duration}`;
  } catch (error) {
    console.error("Error formatting duration:", error);
    return "Error";
  }
};

const safeFormatRate = (amount) => {
  if (!amount) return "N/A";
  try {
    return `${amount}`;
  } catch (error) {
    console.error("Error calculating rate:", error);
    return "Error";
  }
};

const safeFormatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  try {
    const date = new Date(
      ethers.BigNumber.from(timestamp).mul(1000).toString()
    );
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
};

export default Page;
