import Image from "next/image";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";

interface PhotoInputProps {
  onUpload: (file: File | null) => void;
  field: string;
}

const PhotoInput: React.FC<PhotoInputProps> = ({ onUpload, field }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>(`Upload ${field}`);
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
      setFileName("Replace");
      setOriginalFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setPreview(null);
    setFileName(`Upload ${field}`);
    setOriginalFileName(null);
    onUpload(null);
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
          <button onClick={handleDelete} className="ml-2 rounded  p-1">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoInput;
