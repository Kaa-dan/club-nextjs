import { Button } from "@/components/ui/button";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NODES } from "@/lib/constants/nodes";
import NodeCardMini from "@/components/globals/node/node-card";
import AddNodeDialog from "./node/add-node-dialog";
import { completeOnboarding, getNodes } from "./endpoint";
import NodeJoinCard from "./node/node-join-card";
import { Endpoints } from "@/utils/endpoint";
import { useTokenStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ISearchResultsProps {
  setShowAddNodeDialog: (bool: boolean) => void;
  showAddNodeDialog: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}
const SearchResults = ({
  setShowAddNodeDialog,
  showAddNodeDialog,
  searchTerm,
  setSearchTerm,
}: ISearchResultsProps) => {
  const [nodes, setNodes] = useState([]);
  const [requestedNodes, setRequestedNodes] = useState<string[]>([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNodes().then((res) => {
      setNodes(res);
      console.log(res);
    });
  }, [showAddNodeDialog]);
  useEffect(() => {
    setFilteredNodes(
      searchTerm
        ? nodes.filter((node: any) =>
            node.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : nodes
    );
  }, [searchTerm, nodes]);
  const requestToJoinNode = async (nodeId: string) => {
    try {
      setLoading(true);
      const response = await Endpoints.requestToJoinNode(nodeId);
      console.log(response, "node request response");
      if (response?.status === "REQUESTED")
        toast.success("Your request to join has been sent successfully!");
      setRequestedNodes((prev) => [...prev, nodeId]);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "something went while request join node"
      );
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-2 px-8">
      <h2 className="text-lg font-semibold">Search node</h2>
      <div className="flex items-center gap-2 rounded-sm bg-slate-100">
        <Input
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          placeholder="Enter name"
          className="h-8 w-full border-none bg-slate-100"
        />
        <X
          onClick={() => setSearchTerm("")}
          className="cursor-pointer text-slate-600"
        />
      </div>
      <div className="thin-scrollbar mt-4 flex h-80 flex-wrap items-center justify-center gap-5 overflow-y-scroll p-3">
        <div
          className="flex size-36 cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed border-primary p-3 text-base text-primary"
          onClick={() => setShowAddNodeDialog(true)}
        >
          <Plus />
          <span>Create Node</span>
        </div>
        {filteredNodes.map((node: any, index) => {
          return (
            <NodeJoinCard
              onJoin={requestToJoinNode}
              isLoading={loading}
              requested={false}
              key={index}
              node={node}
            />
          );
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
  const { setGlobalUser } = useTokenStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [tncAccepted, setTncAccepted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await completeOnboarding();
      console.log("response", response.data);
      setGlobalUser(response.data);
      router.replace("/");
      console.log(response);
    } catch (error: any) {
      console.log(error?.response?.data);
      toast.error(error?.response?.data?.message || "something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mb-6 flex w-full flex-col">
      <AddNodeDialog open={showAddNodeDialog} setOpen={setShowAddNodeDialog} />
      {showResults ? (
        <SearchResults
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowAddNodeDialog={setShowAddNodeDialog}
          showAddNodeDialog={showAddNodeDialog}
        />
      ) : (
        <>
          <div className="mx-auto flex w-3/5 flex-col gap-2">
            <Label>Enter your node name</Label>
            <Input
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              className="mb-4"
              placeholder="Enter name"
            />
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

      {/* <div className="my-4 flex w-full items-center space-x-2">
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
      </div> */}

      <div className="flex justify-end gap-4 border-t-2">
        <div className="mt-4 flex gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => setStep("interest")}
          >
            Back
          </Button>
          <Button onClick={onSubmit} className="text-white">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
