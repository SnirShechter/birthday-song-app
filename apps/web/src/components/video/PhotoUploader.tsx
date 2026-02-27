"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ImagePlus, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PhotoFile {
  id: string;
  file: File;
  url: string;
}

export interface PhotoUploaderProps {
  maxPhotos?: number;
  onChange?: (photos: PhotoFile[]) => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function generateId(): string {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function PhotoUploader({
  maxPhotos = 10,
  onChange,
}: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);
      const validFiles: PhotoFile[] = [];

      for (const file of fileArray) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setError("Only JPG, PNG, and WebP images are accepted.");
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          setError("File size must be under 10MB.");
          continue;
        }
        if (photos.length + validFiles.length >= maxPhotos) {
          setError(`Maximum ${maxPhotos} photos allowed.`);
          break;
        }
        validFiles.push({
          id: generateId(),
          file,
          url: URL.createObjectURL(file),
        });
      }

      if (validFiles.length > 0) {
        const next = [...photos, ...validFiles];
        setPhotos(next);
        onChange?.(next);
      }
    },
    [photos, maxPhotos, onChange]
  );

  const removePhoto = useCallback(
    (id: string) => {
      const photo = photos.find((p) => p.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.url);
      }
      const next = photos.filter((p) => p.id !== id);
      setPhotos(next);
      onChange?.(next);
    },
    [photos, onChange]
  );

  const handleReorder = useCallback(
    (newOrder: PhotoFile[]) => {
      setPhotos(newOrder);
      onChange?.(newOrder);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files?.length) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const canAdd = photos.length < maxPhotos;

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      {canAdd && (
        <motion.div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-2xl p-8",
            "border-2 border-dashed cursor-pointer",
            "transition-all duration-200",
            isDragOver
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
              : "border-[var(--border)] hover:border-[var(--color-primary)]/50 bg-[var(--surface)]"
          )}
        >
          <motion.div
            animate={isDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
          >
            <ImagePlus
              className={cn(
                "h-8 w-8",
                isDragOver
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--text-muted)]"
              )}
            />
          </motion.div>
          <p className="text-sm font-medium text-[var(--text-muted)]">
            {isDragOver ? "Drop photos here" : "Drag photos or click to upload"}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            JPG, PNG, WebP | Max {maxPhotos} photos | Up to 10MB each
          </p>
        </motion.div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs font-medium text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Photo count */}
      {photos.length > 0 && (
        <p className="text-xs text-[var(--text-muted)]">
          {photos.length}/{maxPhotos} photos
        </p>
      )}

      {/* Thumbnail grid with reorder */}
      {photos.length > 0 && (
        <Reorder.Group
          axis="x"
          values={photos}
          onReorder={handleReorder}
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5"
          as="div"
        >
          <AnimatePresence>
            {photos.map((photo) => (
              <Reorder.Item
                key={photo.id}
                value={photo}
                as="div"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileDrag={{
                  scale: 1.05,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  zIndex: 50,
                }}
                className={cn(
                  "relative aspect-square cursor-grab overflow-hidden rounded-xl",
                  "border border-[var(--glass-border)]",
                  "group"
                )}
              >
                <img
                  src={photo.url}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                {/* Drag handle */}
                <div className="absolute left-1 top-1 rounded-md bg-black/40 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-3.5 w-3.5 text-white" />
                </div>
                {/* Remove button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(photo.id);
                  }}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </div>
  );
}
