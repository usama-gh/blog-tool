"use client";

import { XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function FileUploader({
  fileName,
  setFileName,
  setOriginalFile,
  inputId,
  labelText,
}: {
  fileName: string | null;
  setFileName: any;
  setOriginalFile: any;
  inputId: string;
  labelText: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = (file: File | null) => {
    if (file) {
      if (file.size / 1024 / 1024 > 50) {
        toast.error("File size too big (max 50MB)");
      } else {
        setOriginalFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileName(file.name);
          setData(e.target?.result as string); // Set image data URL
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        className="w-100 group relative flex py-2 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-white text-xs uppercase tracking-wide shadow-sm transition-all dark:border-gray-600 dark:bg-transparent dark:text-gray-600 hover:dark:border-gray-500"
      >
        {labelText}
        {data && (
        <div className="mt-2">
          <img src={data} alt="Preview" className="max-h-8 rounded-md" />
        </div>
      )}

      </label>
      {fileName && (
        <span className="flex items-center justify-between text-center">
          <span className="text-xs text-slate-600 dark:text-gray-500">
            {fileName}
          </span>
          <XCircle
            width={18}
            className="cursor-pointer text-red-400"
            onClick={() => {
              setFileName(null);
              setData(null); // Clear image data URL
            }}
          />
        </span>
      )}

      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          className="sr-only"
          onChange={(e) =>
            handleUpload(e.currentTarget.files && e.currentTarget.files[0])
          }
        />
      </div>

    
    </div>
  );
}
