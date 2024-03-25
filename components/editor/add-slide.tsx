import { Plus } from "lucide-react";

interface Props {
  updateSlides: any;
  index: number;
}
export default function AddSlide({ updateSlides, index }: Props) {
  return (
    <div  onClick={(e) => {
      updateSlides("add", index, "");
    }} className="carousel-item md:w-18 flex h-auto w-20 flex-shrink-0 flex-col items-center justify-center  rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-900/80 dark:text-gray-200  hover:dark:bg-gray-900">
      <button
        type="button"
        className="flex h-full flex-col items-center justify-center text-xs font-semibold tracking-tight"
      >
        <Plus strokeWidth={"2.5px"} width={18} />
        Add Slide
      </button>
    </div>
  );
}
