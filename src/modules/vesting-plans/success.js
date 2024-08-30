import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SuccessComponent = ({ onContinue }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Success!</h2>
      {/* <Button
        onClick={onContinue}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full flex items-center"
      >
        Continue
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button> */}
    </div>
  );
};

export default SuccessComponent;
