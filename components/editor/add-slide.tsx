import { Plus } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  updateSlides: any;
  index: number;
}
export default function AddSlide({ updateSlides, index }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="carousel-item md:w-18 flex h-auto w-20 flex-shrink-0 flex-col items-center justify-center  rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-900/80 dark:text-gray-200  hover:dark:bg-gray-900">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button
            type="button"
            className="flex h-full flex-col items-center justify-center text-xs font-semibold tracking-tight"
          >
            <Plus strokeWidth={"2.5px"} width={18} />
            Add Slide
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[2rem]">
          <DropdownMenuItem>
            <SlideOptionButton
              btnText="Slide"
              onClick={() => updateSlides("add", index, "slide")}
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SlideOptionButton
              btnText="Gated"
              onClick={() => updateSlides("add", index, "gate")}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SlideOptionButton({
  btnText,
  onClick,
}: {
  btnText: string;
  onClick: any;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="w-full cursor-pointer border-b border-gray-200 px-4 py-2 text-left font-medium hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 rtl:text-right dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
      >
        {btnText}
      </button>
    </>
  );
}
