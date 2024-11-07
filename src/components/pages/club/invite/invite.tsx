import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useState } from "react";

export default function Invite() {
  const [email, setEmail] = useState("");

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <DialogTitle>Invite Member</DialogTitle>
      </DialogHeader>
      <form className="space-y-4 pt-4">
        <Input
          placeholder="Enter email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost">
            Cancel
          </Button>
          <Button type="submit">Send</Button>
        </div>
      </form>
    </DialogContent>
  );
}
