"use client";

import { useEffect, useState } from "react";
import ProgressIndicator from "./progress-bar";
import PictureForm from "./picture-form";

import DetailsForm from "./details-form";
import { NodeSearchForm } from "./node-search-form";
import InterestForm from "./interest-form";
import { useTokenStore } from "@/store/store";
import { getOnboarding } from "./endpoint";
import { toast } from "sonner";

type Step = "details" | "image" | "interest" | "node";

export function BoardingForm() {
  const { globalUser, setGlobalUser } = useTokenStore((state) => state);

  const [step, setStep] = useState(globalUser?.onBoardingStage ?? "details");

  const fetchOnboarding = async () => {
    try {
      const response = await getOnboarding();
      console.log(`response at step ${step}:`, response.data);
      if (response?.data) {
        setGlobalUser(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Something Went Wrong!");
      console.log(error);
    }
  };

  // fetch onboarding

  useEffect(() => {
    fetchOnboarding();
  }, [step]);

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
