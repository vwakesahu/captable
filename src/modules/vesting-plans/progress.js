import { motion } from "framer-motion";
export const ProgressSteps = ({ currentStep, onStepClick }) => {
  const steps = ["Setup", "Administration", "Details", "Completed"];

  return (
    <div className="flex justify-between mb-6">
      {steps.map((step, index) => (
        <motion.div
          key={step}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => onStepClick(index)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index === currentStep
                ? "bg-blue-500 text-white"
                : index < currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            initial={false}
            animate={{
              scale: index === currentStep ? 1.1 : 1,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <motion.span
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={index < currentStep ? "check" : "number"}
            >
              {index < currentStep ? "✓" : index + 1}
            </motion.span>
          </motion.div>
          <motion.span
            className={`text-sm mt-2 ${
              index === currentStep
                ? "text-blue-500 font-medium"
                : "text-gray-600"
            }`}
            initial={false}
            animate={{
              fontWeight: index === currentStep ? 600 : 400,
              color: index === currentStep ? "#3B82F6" : "#4B5563",
            }}
          >
            {step}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};
