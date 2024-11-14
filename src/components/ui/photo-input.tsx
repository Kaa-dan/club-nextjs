import Image from "next/image";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import CropDialog from "../globals/cropper/image-cropper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";

interface PhotoInputProps {
  onUpload: (file: File | null) => void;
  field: string;
  initialUrl?: string;
  name?: string;
  initialImageName?: string;
}

const PhotoInput: React.FC<PhotoInputProps> = ({
  onUpload,
  field,
  initialUrl,
  initialImageName,
}) => {
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const [fileName, setFileName] = useState<string>(`Upload ${field}`);
  const [originalFileName, setOriginalFileName] = useState<string | null>(
    initialImageName || null
  );

  // States for crop dialog
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getCropAspectRatio = () => {
    return field.toLowerCase() === "cover" ? 16 / 9 : 1;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const handleCrop = (croppedFile: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(croppedFile);

    setFileName("Replace");
    setOriginalFileName(croppedFile.name);
    onUpload(croppedFile);
    setCropDialogOpen(false);
    setSelectedImage(null);
  };

  const handleDelete = () => {
    setPreview(null);
    setFileName(`Upload ${field}`);
    setOriginalFileName(null);
    setSelectedImage(null);
    onUpload(null);
  };

  const handleDialogChange = (open: boolean) => {
    setCropDialogOpen(open);
    if (!open) {
      setSelectedImage(null);
    }
  };

  return (
    <div>
      <div
        onClick={() => document.getElementById(`photo-input-${field}`)?.click()}
        className="grid cursor-pointer place-items-center rounded-md border border-dashed p-5 transition-colors hover:bg-gray-50"
      >
        <p>+ {fileName}</p>
      </div>
      <input
        id={`photo-input-${field}`}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      {preview && (
        <div className="mt-3 flex items-center justify-between rounded-md border px-2 py-1">
          <div className="flex items-center">
            <Image
              src={preview}
              alt="Preview"
              width={50}
              height={50}
              className="max-h-40 max-w-full rounded-md object-contain"
            />
            <div className="ml-2">
              {originalFileName && (
                <p className="text-sm text-gray-500">{originalFileName}</p>
              )}
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="ml-2 rounded p-1">
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">
                  Are you absolutely sure?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <div className="flex w-full justify-center gap-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <CropDialog
        open={cropDialogOpen}
        onOpenChange={handleDialogChange}
        onCrop={handleCrop}
        imageUrl={selectedImage || ""}
        aspectRatio={getCropAspectRatio()}
        title={`Crop ${field} Photo`}
      />
    </div>
  );
};

export default PhotoInput;
