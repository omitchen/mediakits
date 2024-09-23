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

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        setFiles(acceptedFiles[0]);
        return;
      }

      if (fileRejections.length > 0) {
        toast.warning("Please upload a valid video file");
      }
    },
    []
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

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer transition-colors hover:border-gray-400"
    >
      <input {...getInputProps()} />
      <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500">
        {isDragActive ? "Drop the file here ..." : "Upload or drop file here"}
      </p>
    </div>
  );
}
