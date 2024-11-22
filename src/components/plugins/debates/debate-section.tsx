import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function DebateCard({ author, date }: { author: string; date: string }) {
  return (
    <Card className="border">
      <CardContent>
        <p>
          Hospital staff must prioritize patient care and well-being at all
          times, adhering to professional standards and ethical guidelines.
        </p>
        <div className="flex items-center mt-4">
          <Avatar className="mr-3">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt="Author"
            />
            <AvatarFallback>{author[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">{author}</div>
            <div className="text-xs text-muted-foreground">
              Last updated: {date}
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4 text-sm text-muted-foreground">
          <div>231</div>
          <div>23</div>
          <div>23</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DebateSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 ">
      <div className=" flex flex-col gap-4 ">
        <div className="flex justify-between items-center ">
          <div className="text-lg font-bold">For (182)</div>
          <Button variant="outline" className="text-blue-600">
            + Add a point for
          </Button>
        </div>
        <DebateCard author="Annette Black" date="25 Sep 2024" />
        <DebateCard author="Brooklyn Simmons" date="25 Sep 2024" />
        <DebateCard author="Bessie Cooper" date="25 Sep 2024" />
        <DebateCard author="Ralph Edwards" date="25 Sep 2024" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center ">
          <div className="text-lg font-bold">Against (45)</div>
          <Button variant="outline" className="text-red-600">
            + Add a point against
          </Button>
        </div>
        <DebateCard author="Annette Black" date="25 Sep 2024" />
        <DebateCard author="Brooklyn Simmons" date="25 Sep 2024" />
        <DebateCard author="Bessie Cooper" date="25 Sep 2024" />
        <DebateCard author="Ralph Edwards" date="25 Sep 2024" />
      </div>
    </div>
  );
}
