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
    <div className="flex flex-col px-8 gap-2">
      <h2 className="text-lg font-semibold">Search node</h2>
      <div className="flex items-center gap-2 bg-slate-100 rounded-sm">
        <Input
          placeholder="Enter name"
          className="w-full h-8 bg-slate-100 border-none"
        />
        <X className="text-slate-600" />
      </div>
      <div className="flex flex-wrap gap-5 mt-4">
        <div
          className="flex flex-col items-center justify-center text-base text-primary border-2 border-primary border-dashed rounded-sm gap-1 size-[9rem] p-3 cursor-pointer"
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

export const NodeSearchForm = () => {
  const [tncAccepted, setTncAccepted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
  return (
    <div className="w-full flex flex-col mb-6">
      <AddNodeDialog open={showAddNodeDialog} setOpen={setShowAddNodeDialog} />
      {showResults ? (
        <SearchResults setShowAddNodeDialog={setShowAddNodeDialog} />
      ) : (
        <>
          <div className="flex flex-col gap-2 w-3/5 mx-auto">
            <Label>Enter your node name</Label>
            <Input className="mb-4" placeholder="Enter name" />
            <Label>Pin code</Label>
            <Input placeholder="Enter code" />
            <Button
              className="w-full mt-6"
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

      <div className="my-4 w-full flex items-center space-x-2">
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
        className="hover:bg-black hover:text-white px-6 self-end mr-8"
      >
        Back
      </Button>
    </div>
  );
};
