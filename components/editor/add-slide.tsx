import { Plus } from "lucide-react";
import { useState } from "react";

interface Props {
  updateSlides: any;
  index: number;
}
export default function AddSlide({ updateSlides, index }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={(e) => {
        setOpen((state) => !state);
      }}
      className="carousel-item md:w-18 flex h-auto w-20 flex-shrink-0 flex-col items-center justify-center  rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-900/80 dark:text-gray-200  hover:dark:bg-gray-900"
    >
      <button
        type="button"
        className="flex h-full flex-col items-center justify-center text-xs font-semibold tracking-tight"
      >
        <Plus strokeWidth={"2.5px"} width={18} />
        Add Slide
      </button>

      {open && (
        <div className="w-20 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          <button
            type="button"
            onClick={() => updateSlides("add", index, "slide")}
            className="w-full cursor-pointer border-b border-gray-200 px-4 py-2 text-left font-medium hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 rtl:text-right dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
          >
            Slide
          </button>
          <button
            type="button"
            onClick={() => updateSlides("add", index, "gate")}
            className="w-full cursor-pointer border-b border-gray-200 px-4 py-2 text-left font-medium hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 rtl:text-right dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
          >
            Gated
          </button>
        </div>
      )}
    </div>
  );
}
