import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import { Endpoints } from "@/utils/endpoint";
import Image from "next/image";

// Schema definition
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const addPointSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Point must be at least 10 characters" })
    .max(1000, { message: "Point must not exceed 1000 characters" }),
  image: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB."
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
});

type AddPointFormData = z.infer<typeof addPointSchema>;

interface AddPointDialogProps {
  side: "support" | "against";
  debateId: string;
  trigger?: React.ReactNode;
  fetchArg: () => void;
  entityType: TForum;
  entity: string;
  endingDate: Date;
}

export function AddPointDialog({
  side,
  debateId,
  entityType,
  entity,
  trigger,
  endingDate,
  fetchArg,
}: AddPointDialogProps) {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [participationStatus, setParticipationStatus] =
    useState<boolean>(false); // Default status is false
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (endingDate) {
      const _isExpired =
        new Date(endingDate).setHours(0, 0, 0, 0) <
        new Date().setHours(0, 0, 0, 0);
      setIsExpired(_isExpired); // true if expir
    }
  }, [endingDate]);

  const form = useForm<AddPointFormData>({
    resolver: zodResolver(addPointSchema),
    defaultValues: {
      content: "",
      image: undefined,
    },
  });

  const handleImagePreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Fetch participation status when component mounts
  useEffect(() => {
    const type = searchParams.get("type");
    const adoptedId = searchParams.get("adoptedId");
    const idToCheck = type === "adopted" ? adoptedId : debateId;

    if (idToCheck) {
      Endpoints.checkParticipationStatus(idToCheck, entityType, entity).then(
        (res) => {
          setParticipationStatus(res.isAllowed);
        }
      );
    }
  }, [debateId, entityType, entity, searchParams]);
  const onSubmit = async (data: AddPointFormData) => {
    try {
      const type = searchParams.get("type");
      const adoptedId = searchParams.get("adoptedId");
      const idToCheck = type === "adopted" ? adoptedId : debateId;

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append("content", data.content);
      formData.append("side", side);
      formData.append("debateId", idToCheck as string);

      if (data.image) {
        formData.append("file", data.image);
      }

      const response = await Endpoints.postArgument(formData);
      fetchArg();

      form.reset();
      setPreview(null);
      setOpen(false);
    } catch (error) {
      console.error("Failed to submit point:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Show the Add Point button only if status is true */}
      {participationStatus && (
        <DialogTrigger asChild>
          {!isExpired && // Only show the button if the debate is not expired
            (trigger || (
              <Button
                variant="outline"
                className={
                  side === "support" ? "text-blue-600" : "text-red-600"
                }
              >
                + Add a point {side}
              </Button>
            ))}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Add new {side} point
            <Button
              variant="ghost"
              size="icon"
              className="size-6 p-0"
              onClick={() => setOpen(false)}
            ></Button>
          </DialogTitle>
          <DialogDescription>
            Write your point for the debate. Be clear and concise.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Point</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your words..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Image (Optional)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {preview ? (
                        <div className="relative">
                          <Image
                            width={200}
                            height={200}
                            src={preview}
                            alt="Preview"
                            className="max-h-48 w-full rounded-lg object-contain"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() => {
                              setPreview(null);
                              onChange(undefined);
                            }}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                              <ImagePlus className="mb-2 size-8 text-gray-400" />
                              <p className="text-sm text-gray-500">
                                Click to upload image
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                PNG, JPG, WebP up to 5MB
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                  handleImagePreview(file);
                                }
                              }}
                              {...field}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={side === "support" ? "bg-blue-600" : "bg-red-600"}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
