"use client";

import { XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function FileUploader({
  defaultValue,
  name,
  setFile,
}: {
  defaultValue: string | null;
  name: "file";
  setFile: any;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState({
    [name]: defaultValue,
  });
  const [filename, SetFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = (file: File | null) => {
    if (file) {
      if (file.size / 1024 / 1024 > 50) {
        toast.error("File size too big (max 50MB)");
      }
      //  else if (
      //   !file.type.includes("png") &&
      //   !file.type.includes("jpg") &&
      //   !file.type.includes("jpeg")
      // ) {
      //   toast.error("Invalid file type (must be .png, .jpg, or .jpeg)");
      // }
      else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setData((prev) => ({ ...prev, [name]: e.target?.result as string }));
          setFile(e.target?.result as string);
          SetFileName(file.name);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      <label
        htmlFor="leadFile"
        className="w-100 group relative mt-2 flex h-12 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50 dark:border-gray-500"
      >
        Upload file
      </label>
      {filename && (
        <div className="mt-1 flex items-center justify-between">
          <span>{filename}</span>
          <XCircle
            width={18}
            className="cursor-pointer text-red-400"
            onClick={() => {
              setData((prev) => ({ ...prev, [name]: defaultValue }));
              setFile("");
              SetFileName("");
            }}
          />
        </div>
      )}

      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          id="leadFile"
          ref={inputRef}
          name={name}
          type="file"
          // accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.currentTarget.files && e.currentTarget.files[0];
            handleUpload(file);
          }}
        />
      </div>
    </div>
  );
}
