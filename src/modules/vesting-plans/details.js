const { Button } = require("@/components/ui/button");
const { Input } = require("@/components/ui/input");
const {
  Edit,
  Info,
  Calendar,
  Trash2,
  Settings,
  Upload,
} = require("lucide-react");
import { motion } from "framer-motion";
import { useState } from "react";

export const DetailsStep = () => {
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
