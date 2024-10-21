import React from "react";

export type Step = "Details" | "Picture" | "Interest" | "Node";

interface ProgressIndicatorProps {
  currentStep: Step;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
}) => {
  const steps: Step[] = ["Details", "Picture", "Interest", "Node"];

  const getStepIndex = (step: Step) => steps.indexOf(step);

  return (
    <div className="flex ">
      {steps.map((step, index) => {
        const isCurrent = currentStep === step;
        const stepIndex = getStepIndex(step);
        const currentStepIndex = getStepIndex(currentStep);

        return (
          <div key={step} className="flex items-center">
            <div
              className={`flex size-6 items-center  justify-center  rounded-full !p-3 text-base font-medium
              ${
                isCurrent || stepIndex <= currentStepIndex
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {stepIndex < currentStepIndex ? (
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <p
              className={`px-1 pl-2 text-base font-medium 
              ${isCurrent ? " text-primary" : stepIndex < currentStepIndex ? "text-primary" : ""}`}
            >
              {step}
            </p>
            {index < steps.length - 1 && (
              <div className=" flex justify-center ">
                <div
                  className={`mx-3 h-0.5 w-6 ${stepIndex < currentStepIndex ? "bg-primary" : "bg-gray-200"}`}
                ></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressIndicator;
