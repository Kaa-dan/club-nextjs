import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  status: string;
  askedBy: string;
  answeredBy: string;
  Date: string;
  createdAt: string;
  updatedAt: string;
  project: string;
}

interface FAQListProps {
  faqs: FAQ[];
}

const FAQList: React.FC<FAQListProps> = ({ faqs }) => {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4">
      <div className="mb-6 flex items-center gap-2">
        <QuestionMarkCircledIcon className="size-6 text-primary" />
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq._id} value={faq._id}>
            <AccordionTrigger className="text-left">
              <div className="flex flex-col items-start">
                <span className="text-lg">{faq.question}</span>
                <span className="mt-1 text-sm text-muted-foreground">
                  {new Date(faq.Date).toLocaleDateString()}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pb-4 pt-2">
                <p className="text-base text-muted-foreground">{faq.answer}</p>
                <div className="mt-4 text-sm text-muted-foreground">
                  Status: <span className="capitalize">{faq.status}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQList;
