import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItemType[];
  className?: string;
}

const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({
  items,
  className = "",
}) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === items.length - 1 ? (
                <BreadcrumbPage className="capitalize">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink className="capitalize" href={item.href!}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="size-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export type { BreadcrumbItemType, CustomBreadcrumbProps };
export { CustomBreadcrumb };
