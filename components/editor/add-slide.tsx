import { Plus, PenLine, Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  updateSlides: any;
  index: number;
  canCreateGateSlide: boolean;
}
export default function AddSlide({
  updateSlides,
  index,
  canCreateGateSlide,
}: Props) {
  return (
    <div className="carousel-item md:w-18 flex h-auto w-20 flex-shrink-0 flex-col items-center justify-center  rounded-lg  text-slate-600 dark:text-gray-400 ">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-0 dark:border-gray-600">
          <span className="flex h-full flex-col items-center justify-center text-xs font-semibold tracking-tight">
            <Plus strokeWidth={"2.5px"} width={18} />
            Add Slide
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-2xl">
          <DropdownMenuItem
            className="cursor-pointer justify-center"
            onClick={() => updateSlides("add", index, "slide")}
          >
            <PenLine strokeWidth={"2.5px"} width={18} />
            <span className="ml-2">Slide</span>
          </DropdownMenuItem>
          {canCreateGateSlide && (
            <DropdownMenuItem
              className="cursor-pointer justify-center"
              onClick={() => updateSlides("add", index, "gate")}
            >
              <Lock strokeWidth={"2.5px"} width={18} />
              <span className="ml-2">Gated</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
