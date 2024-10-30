"use client";

import { useEffect, useState } from "react";
import ProgressIndicator from "./progress-bar";
import PictureForm from "./picture-form";

import DetailsForm from "./details-form";
import { NodeSearchForm } from "./node-search-form";
import InterestForm from "./interest-form";
import { useTokenStore } from "@/store/store";

type Step = "details" | "image" | "interest" | "node";

export function BoardingForm() {
  const { globalUser } = useTokenStore((state) => ({
    globalUser: state.globalUser,
  }));

  console.log(globalUser?.onBoardingStage);

  const [step, setStep] = useState(globalUser?.onBoardingStage ?? "details");

  useEffect(() => {
    if (globalUser?.onBoardingStage) {
      setStep(globalUser.onBoardingStage);
    }
  }, [globalUser?.onBoardingStage]);

  return (
    <>
      {globalUser?.onBoardingStage ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-2xl px-2">
            <h2 className="mb-2 text-center text-2xl font-bold">
              Hey, Welcome to Clubwize 👋
            </h2>
            <p className="mb-8 text-center text-gray-600">
              Welcome to the team, rookie! Get ready to crush it with Clubwize!
            </p>

            <div className="flex justify-center p-6">
              <ProgressIndicator
                steps={["details", "image", "interest", "node"]}
                currentStep={step}
              />
            </div>

            {step === "details" && <DetailsForm setStep={setStep} />}

            {step === "image" && <PictureForm setStep={setStep} />}

            {step === "interest" && <InterestForm setStep={setStep} />}

            {step === "node" && <NodeSearchForm setStep={setStep} />}
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen items-center justify-center text-2xl">
          Loading...
        </div>
      )}
    </>
  );
}
