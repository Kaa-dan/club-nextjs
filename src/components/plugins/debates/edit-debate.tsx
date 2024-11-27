import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, X } from "lucide-react";
import ReactQuill from "react-quill-new";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const debateSchema = z.object({
  topic: z.string().min(1, "Debate topic is required"),
  closingDate: z.string().optional(),
  significance: z.string().min(1, "Significance is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  tags: z.array(z.string()),
  openingCommentsFor: z.string().min(1, "Opening comments (For) are required"),
  openingCommentsAgainst: z
    .string()
    .min(1, "Opening comments (Against) are required"),
  isPublic: z.boolean().default(false),
  files: z.array(z.any()).optional(),
});

type DebateFormValues = z.infer<typeof debateSchema>;

interface EditDebateFormProps {
  debate: DebateFormValues;
  onSubmit: (data: DebateFormValues) => Promise<void>;
}

const EditDebateForm = ({ debate, onSubmit }: EditDebateFormProps) => {
  const [files, setFiles] = useState<File[]>(debate.files || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const router = useRouter();

  const form = useForm<DebateFormValues>({
    resolver: zodResolver(debateSchema),
    defaultValues: {
      ...debate,
      files: debate.files || [],
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      form.setValue("files", [...files, ...newFiles]);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
    form.setValue("files", [...files, ...droppedFiles]);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    form.setValue("files", updatedFiles);
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <Card className="mx-auto max-w-5xl">
      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => setIsDialogOpen(true))}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Debate Topic</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="closingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Closing Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type="date" className="pl-10" />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="significance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Significance</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-20 resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagAdd}
                          placeholder="Type a tag and press Enter"
                          className="mb-2"
                        />
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center rounded-full bg-gray-100 px-3 py-1"
                            >
                              <span className="text-sm">{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleTagRemove(tag)}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                              >
                                <X className="size-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Files/Media</FormLabel>
                  <div
                    className="cursor-pointer rounded-lg border-2 border-dashed p-4 text-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  >
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <span className="text-gray-500">
                      + Drag or Upload files
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="group relative">
                        <div className="rounded-lg border bg-gray-50 p-2">
                          <div className="relative mb-2 h-32">
                            <Image
                              src={
                                typeof file === "string"
                                  ? file
                                  : URL.createObjectURL(file)
                              }
                              alt={
                                typeof file === "string"
                                  ? "Uploaded file"
                                  : file.name
                              }
                              className="rounded object-cover"
                              fill
                            />
                          </div>
                          {typeof file !== "string" && (
                            <div className="truncate text-sm">
                              <p className="font-medium">{file.name}</p>
                              <p className="text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <Controller
                name="openingCommentsFor"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Comments (For)</FormLabel>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      className="bg-white"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="openingCommentsAgainst"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Comments (Against)</FormLabel>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      className="bg-white"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Make this debate public
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Debate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default EditDebateForm;
