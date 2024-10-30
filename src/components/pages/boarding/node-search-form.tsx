import { Button } from "@/components/ui/button";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { NODES } from "@/lib/constants/nodes";
import NodeCardMini from "@/components/globals/node/node-card";
import AddNodeDialog from "./node/add-node-dialog";

interface ISearchResultsProps {
  setShowAddNodeDialog: (bool: boolean) => void;
}
const SearchResults = ({ setShowAddNodeDialog }: ISearchResultsProps) => {
  return (
    <div className="flex flex-col gap-2 px-8">
      <h2 className="text-lg font-semibold">Search node</h2>
      <div className="flex items-center gap-2 rounded-sm bg-slate-100">
        <Input
          placeholder="Enter name"
          className="h-8 w-full border-none bg-slate-100"
        />
        <X className="text-slate-600" />
      </div>
      <div className="mt-4 flex flex-wrap gap-5">
        <div
          className="flex size-36 cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed border-primary p-3 text-base text-primary"
          onClick={() => setShowAddNodeDialog(true)}
        >
          <Plus />
          <span>Create Node</span>
        </div>
        {NODES.map((node, index) => {
          return <NodeCardMini key={node.name} node={node} />;
        })}
      </div>
    </div>
  );
};

type Step = "details" | "image" | "interest" | "node";

interface InterestFormProps {
  setStep: (step: Step) => void;
}

export const NodeSearchForm: React.FC<InterestFormProps> = ({ setStep }) => {
  const [tncAccepted, setTncAccepted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
  return (
    <div className="mb-6 flex w-full flex-col">
      <AddNodeDialog open={showAddNodeDialog} setOpen={setShowAddNodeDialog} />
      {showResults ? (
        <SearchResults setShowAddNodeDialog={setShowAddNodeDialog} />
      ) : (
        <>
          <div className="mx-auto flex w-3/5 flex-col gap-2">
            <Label>Enter your node name</Label>
            <Input className="mb-4" placeholder="Enter name" />
            <Label>Pin code</Label>
            <Input placeholder="Enter code" />
            <Button
              className="mt-6 w-full"
              onClick={() => setShowResults(true)}
            >
              Search for node
            </Button>
            <Button
              onClick={() => setShowAddNodeDialog(true)}
              variant={"naked"}
              className="w-full"
            >
              + Create a node
            </Button>
          </div>
        </>
      )}

      <div className="my-4 flex w-full items-center space-x-2">
        <Checkbox
          checked={tncAccepted}
          onCheckedChange={(bool) => setTncAccepted(bool ? true : false)}
        />
        <Label className="flex gap-1">
          I agree to the{" "}
          <Link href="#" className="text-primary">
            Terms of Services
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary">
            Privacy Policy
          </Link>
        </Label>
      </div>
      <Button
        variant={"outline"}
        className="mr-8 self-end px-6 hover:bg-black hover:text-white"
        onClick={() => setStep("interest")}
      >
        Back
      </Button>
    </div>
  );
};
