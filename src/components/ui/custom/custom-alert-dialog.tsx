import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogType = "warning" | "error" | "info" | "success";

interface CustomAlertDialogProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  cancelText?: string;
  actionText?: string;
  onAction?: () => void;
  onCancel?: () => void;
  type?: DialogType;
  showIcon?: boolean;
}

const dialogStyles: Record<
  DialogType,
  {
    icon: React.ElementType;
    iconColor: string;
    actionButtonClass: string;
  }
> = {
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    actionButtonClass:
      "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-red-500",
    actionButtonClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    actionButtonClass: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
  success: {
    icon: CheckCircle2,
    iconColor: "text-green-500",
    actionButtonClass:
      "bg-primary text-white hover:bg-green-600 focus:ring-green-500",
  },
};

const CustomAlertDialog = ({
  trigger,
  title,
  description,
  cancelText = "Cancel",
  actionText = "Continue",
  onAction,
  onCancel,
  type = "warning",
  showIcon = true,
}: CustomAlertDialogProps) => {
  const { icon: Icon, iconColor, actionButtonClass } = dialogStyles[type];

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex w-full items-center  justify-center gap-2">
            {showIcon && <Icon className={cn("h-5 w-5", iconColor)} />}
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-center">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel
            onClick={onCancel}
            className="border-gray-200 hover:bg-gray-100 hover:text-gray-900"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAction} className={actionButtonClass}>
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;

/*
  
  // Basic warning dialog (default)
<CustomAlertDialog
  trigger={<Button>Delete Item</Button>}
  title="Delete Confirmation"
  description="Are you sure you want to delete this item? This action cannot be undone."
  actionText="Delete"
  onAction={() => handleDelete()}
/>

// Error dialog
<CustomAlertDialog
  trigger={<Button variant="destructive">Remove Access</Button>}
  title="Remove Access Rights"
  description="This will immediately revoke all access permissions for this user."
  type="error"
  actionText="Remove Access"
  cancelText="Keep Access"
  onAction={() => handleRemoveAccess()}
/>

// Success dialog
<CustomAlertDialog
  trigger={<Button>Complete Order</Button>}
  title="Complete Order"
  description="Are you sure you want to mark this order as complete?"
  type="success"
  actionText="Complete"
  onAction={() => completeOrder()}
/>

// Info dialog without icon
<CustomAlertDialog
  trigger={<Button variant="outline">Archive</Button>}
  title="Archive Project"
  description="This project will be moved to archives and can be restored later."
  type="info"
  showIcon={false}
  actionText="Archive"
  onAction={() => archiveProject()}
/>
  
  */
