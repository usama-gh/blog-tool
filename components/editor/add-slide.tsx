import { Plus,PenLine,Lock } from "lucide-react";
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
        <DropdownMenuTrigger className="border border-gray-200 p-2 rounded-lg">
          <button
            type="button"
            className="flex h-full flex-col items-center justify-center text-xs font-semibold tracking-tight"
          >
            <Plus strokeWidth={"2.5px"} width={18} />
            Add Slide
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-2xl">
          <DropdownMenuItem className="justify-center">
          <PenLine strokeWidth={"2.5px"} width={18} />
            <SlideOptionButton
              btnText="Slide"
              onClick={() => updateSlides("add", index, "slide")}
            />
          </DropdownMenuItem>
          <DropdownMenuItem  className="justify-center">
          <Lock strokeWidth={"2.5px"} width={18} />
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
        className="ml-2  cursor-pointer"
      >
        {btnText}
      </button>
    </>
  );
}
