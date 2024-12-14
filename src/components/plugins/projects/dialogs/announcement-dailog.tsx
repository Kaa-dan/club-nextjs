import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { X, FileIcon, Image as ImageIcon, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProjectApi } from "../projectApi";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const formSchema = z.object({
  announcement: z.string().min(1, "Announcement is required"),
  files: z
    .array(
      z.object({
        file: z.any(),
        preview: z.string(),
      })
    )
    .max(5, "Maximum 5 files allowed")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AnnouncementDialog = ({
  projectId,
  setOpen,
  fetchAnnouncement,
}: {
  setOpen: () => void;
  projectId: string;
  fetchAnnouncement: () => void;
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      announcement: "",
      files: [],
    },
  });
  console.log({ projectId });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentFiles = form.getValues("files") || [];

    if (currentFiles.length + files.length > 5) {
      form.setError("files", {
        message: "Maximum 5 files allowed",
      });
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        form.setError("files", {
          message: "File size should be less than 5MB",
        });
        return false;
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        form.setError("files", {
          message: "Invalid file type",
        });
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : file.type === "application/pdf"
          ? "/pdf-icon.png"
          : "/doc-icon.png",
    }));

    form.setValue("files", [...currentFiles, ...newFiles]);
  };

  const removeFile = (index: number) => {
    const files = form.getValues("files") || [];
    const fileToRemove = files[index];

    if (fileToRemove.preview.startsWith("blob:")) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter((_, i) => i !== index);
    form.setValue("files", updatedFiles);
  };
  const onSubmit = async (values: FormValues) => {
    try {
      console.log({ values });
      console.log({ projectId });

      const formData = new FormData();
      formData.append("announcement", values.announcement);
      formData.append("projectId", projectId);

      values.files?.forEach((fileObj, index) => {
        formData.append(`file`, fileObj.file);
      });

      // ProjectApi.createAnnouncement(formData).then(() => {
      //   setOpen();
      //   form.reset();
      //   fetchAnnouncement();
      //   toast.success("Announcement created successfully!");
      // });

      const response = await ProjectApi.createAnnouncement(formData);
      setOpen();
      form.reset();
      fetchAnnouncement();
      toast.success("Announcement created successfully!");
      console.log("Announcement submitted successfully");
    } catch (error) {
      console.error("Error submitting announcement:", error);
    }
  };

  React.useEffect(() => {
    // Cleanup previews on unmount
    return () => {
      const files = form.getValues("files") || [];
      files.forEach((file) => {
        if (file.preview.startsWith("blob:")) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [form]);

  const files = form.watch("files") || [];

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New Announcement</DialogTitle>
        <DialogDescription>
          Create a new announcement and attach relevant files.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="announcement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Announcement</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write here..."
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
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Files/Media</FormLabel>
                <FormControl>
                  <div className="rounded-lg border-2 border-dashed p-4 transition hover:border-primary/50">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      accept={ACCEPTED_FILE_TYPES.join(",")}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex cursor-pointer flex-col items-center justify-center"
                    >
                      <div className="text-sm text-muted-foreground">
                        Drag or Upload a file (max 5 files)
                      </div>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative rounded-lg border p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 size-6"
                    onClick={() => removeFile(index)}
                  >
                    <X className="size-4" />
                  </Button>
                  {file.file.type.startsWith("image/") ? (
                    <img
                      src={file.preview}
                      alt="preview"
                      className="h-20 w-full rounded object-cover"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2">
                      {file.file.type.includes("pdf") ? (
                        <FileText className="size-8 text-red-500" />
                      ) : (
                        <FileIcon className="size-8 text-blue-500" />
                      )}
                      <span className="truncate text-sm">{file.file.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              className="flex items-center rounded-md bg-green-500 px-4 py-2 text-white "
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size="1rem" />
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AnnouncementDialog;
