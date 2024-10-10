import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const CreateVestingPlans = ({ button = "secondary" }) => {
  return (
    <div>
      <Link
        href={"/vesting-plans/create"}
        className={
          buttonVariants({ variant: button }) +
          "h-full bg-muted text-muted-foreground hover:bg-muted-foreground/10 flex items-center justify-center gap-2 py-2.5"
        }
      >
        {/* <PlusIcon /> */}
        Create a Vesting Plan
      </Link>
    </div>
  );
};

export default CreateVestingPlans;
