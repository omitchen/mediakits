import React, { useState, useCallback, useEffect } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

export default function FileUpload({
  onChange,
}: {
  onChange: (file: File) => void;
}) {
  const [files, setFiles] = useState<File>();

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith("video/")) {
      setFiles(file);
    } else {
      toast.warning("Please upload a valid video file");
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        handleFile(acceptedFiles[0]);
        return;
      }

      if (fileRejections.length > 0) {
        toast.warning("Please upload a valid video file");
      }
    },
    [handleFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    },
  });

  useEffect(() => {
    if (files) {
      onChange(files);
    }
  }, [files, onChange]);

  useEffect(() => {
    const handleGlobalPaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("video") !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              handleFile(file);
            }
          } else {
            toast.warning("Please upload a valid video file");
          }
          break;
        }
      }
    };

    document.addEventListener("paste", handleGlobalPaste);
    return () => {
      document.removeEventListener("paste", handleGlobalPaste);
    };
  }, [handleFile]);

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer transition-colors hover:border-gray-400"
    >
      <input {...getInputProps()} />
      <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500">
        {isDragActive
          ? "Drop files here ..."
          : "Upload, drag and drop, or paste files here"}
      </p>
    </div>
  );
}
