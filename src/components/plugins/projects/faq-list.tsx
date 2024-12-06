"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/lable";

interface FAQListProps {
  //   faqs: TProjectData["faqs"][] | undefined;
  faqs: any;
}

const FAQList: React.FC<FAQListProps> = ({ faqs }) => {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4">
      <div className="mb-6 flex items-center gap-2">
        <QuestionMarkCircledIcon className="size-6 text-primary" />
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs?.map((faq: TProjectData["faqs"]) => (
          <AccordionItem key={faq._id} value={faq._id}>
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex flex-col items-start">
                <span className="text-lg">{faq.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pb-4 pt-2">
                <p className="text-base text-muted-foreground">{faq.answer}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-5 text-primary" variant={"outline"}>
              <QuestionMarkCircledIcon className="size-5 text-primary" />
              Ask a Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
              <DialogDescription>
                {`Ask your queries regarding the project here.`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="question" className="">
                  Ask question
                </Label>
                <Input
                  id="question"
                  placeholder="Write here..."
                  defaultValue=""
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FAQList;
