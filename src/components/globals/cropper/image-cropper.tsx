import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCrop: (file: File) => void;
  imageUrl: string;
  aspectRatio?: number;
  title?: string;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragStart {
  x: number;
  y: number;
}

type DragMode = "move" | "nw" | "ne" | "sw" | "se" | null;

export function CropDialog({
  open,
  onOpenChange,
  onCrop,
  imageUrl,
  aspectRatio = 1,
  title = "Crop Image",
}: CropDialogProps): JSX.Element {
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragStart, setDragStart] = useState<DragStart>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawCropOverlay = (): void => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw dark overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, cropArea.y);
    ctx.fillRect(0, cropArea.y, cropArea.x, cropArea.height);
    ctx.fillRect(
      cropArea.x + cropArea.width,
      cropArea.y,
      canvas.width - (cropArea.x + cropArea.width),
      cropArea.height
    );
    ctx.fillRect(
      0,
      cropArea.y + cropArea.height,
      canvas.width,
      canvas.height - (cropArea.y + cropArea.height)
    );

    // Draw crop border
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Draw handles
    const handleSize = 8;
    ctx.fillStyle = "#fff";

    const handles = [
      { x: cropArea.x, y: cropArea.y },
      { x: cropArea.x + cropArea.width, y: cropArea.y },
      { x: cropArea.x, y: cropArea.y + cropArea.height },
      { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height },
    ];

    handles.forEach(({ x, y }) => {
      ctx.fillRect(
        x - handleSize / 2,
        y - handleSize / 2,
        handleSize,
        handleSize
      );
    });
  };

  useEffect(() => {
    if (open && imageUrl) {
      const img = new Image();
      imageRef.current = img;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const maxWidth = 400;
        const maxHeight = aspectRatio > 1 ? maxWidth / aspectRatio : maxWidth;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const cropWidth = Math.min(width * 0.8, height * aspectRatio * 0.8);
        const cropHeight = cropWidth / aspectRatio;
        const x = (width - cropWidth) / 2;
        const y = (height - cropHeight) / 2;

        setCropArea({ x, y, width: cropWidth, height: cropHeight });
      };
      img.src = imageUrl;
    }
  }, [imageUrl, open, aspectRatio]);

  useEffect(() => {
    drawCropOverlay();
  }, [cropArea]);

  const getResizeMode = (x: number, y: number): DragMode => {
    const handleSize = 8;
    const { x: cropX, y: cropY, width, height } = cropArea;

    // Check corners
    if (Math.abs(x - cropX) <= handleSize && Math.abs(y - cropY) <= handleSize)
      return "nw";
    if (
      Math.abs(x - (cropX + width)) <= handleSize &&
      Math.abs(y - cropY) <= handleSize
    )
      return "ne";
    if (
      Math.abs(x - cropX) <= handleSize &&
      Math.abs(y - (cropY + height)) <= handleSize
    )
      return "sw";
    if (
      Math.abs(x - (cropX + width)) <= handleSize &&
      Math.abs(y - (cropY + height)) <= handleSize
    )
      return "se";

    // Check if inside crop area
    if (x >= cropX && x <= cropX + width && y >= cropY && y <= cropY + height)
      return "move";

    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mode = getResizeMode(x, y);
    if (mode) {
      setIsDragging(true);
      setDragMode(mode);
      setDragStart({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!isDragging) {
      const mode = getResizeMode(x, y);
      canvas.style.cursor =
        mode === "move" ? "move" : mode ? "nwse-resize" : "default";
      return;
    }

    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    const newCropArea = { ...cropArea };

    switch (dragMode) {
      case "move":
        newCropArea.x = Math.max(
          0,
          Math.min(cropArea.x + dx, canvas.width - cropArea.width)
        );
        newCropArea.y = Math.max(
          0,
          Math.min(cropArea.y + dy, canvas.height - cropArea.height)
        );
        break;
      case "nw":
      case "ne":
      case "sw":
      case "se": {
        const newWidth = dragMode.includes("w")
          ? cropArea.width - dx
          : cropArea.width + dx;

        newCropArea.width = Math.max(50, newWidth);
        newCropArea.height = newCropArea.width / aspectRatio;

        if (dragMode.includes("w")) {
          newCropArea.x = cropArea.x + (cropArea.width - newCropArea.width);
        }
        if (dragMode.includes("n")) {
          newCropArea.y = cropArea.y + (cropArea.height - newCropArea.height);
        }
        break;
      }
    }

    // Ensure bounds
    newCropArea.x = Math.max(
      0,
      Math.min(newCropArea.x, canvas.width - newCropArea.width)
    );
    newCropArea.y = Math.max(
      0,
      Math.min(newCropArea.y, canvas.height - newCropArea.height)
    );
    newCropArea.width = Math.min(
      newCropArea.width,
      canvas.width - newCropArea.x
    );
    newCropArea.height = newCropArea.width / aspectRatio;

    setCropArea(newCropArea);
    setDragStart({ x, y });
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
    setDragMode(null);
  };

  const handleCrop = (): void => {
    if (!canvasRef.current || !imageRef.current) return;

    const tempCanvas = document.createElement("canvas");
    const size = cropArea.width;
    tempCanvas.width = size;
    tempCanvas.height = size / aspectRatio;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // Calculate scaling
    const scaleX = imageRef.current.naturalWidth / canvasRef.current.width;
    const scaleY = imageRef.current.naturalHeight / canvasRef.current.height;

    const sourceX = cropArea.x * scaleX;
    const sourceY = cropArea.y * scaleY;
    const sourceWidth = cropArea.width * scaleX;
    const sourceHeight = cropArea.height * scaleY;

    tempCtx.drawImage(
      imageRef.current,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      size,
      size / aspectRatio
    );

    tempCanvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "cropped-image.jpg", {
            type: "image/jpeg",
          });
          onCrop(file);
          onOpenChange(false);
        }
      },
      "image/jpeg",
      0.8
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-2">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="mx-auto"
          />
        </div>

        <div className="text-sm text-gray-600 text-center">
          Drag to adjust the crop area.
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCrop}>Crop Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CropDialog;
