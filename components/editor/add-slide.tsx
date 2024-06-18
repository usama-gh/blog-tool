import { Plus, PenLine, Lock, Magnet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lead } from "@prisma/client";
import { useModal } from "@/components/modal/provider";
import LinkLeadModal from "../modal/link-lead";
import { useState } from "react";

interface Props {
  updateSlides: any;
  index: number;
  canCreateGateSlide: boolean;
  canCreateLeadSlide: boolean;
  leads: Lead[];
}
export default function AddSlide({
  updateSlides,
  index,
  canCreateGateSlide,
  canCreateLeadSlide,
  leads,
}: Props) {
  const modal = useModal();

  const openLeadMagnetModal = () => {
    modal?.show(
      <LinkLeadModal
        leads={leads}
        type="lead"
        createLeadSlide={createLeadSlide}
      />,
    );
  };

  const createLeadSlide = (lead: Lead | undefined) => {
    if (!lead) return;

    updateSlides("add", index, "lead", lead);
  };

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
          {canCreateLeadSlide && (
            <DropdownMenuItem
              className="cursor-pointer justify-center"
              onClick={openLeadMagnetModal}
            >
              <Magnet strokeWidth={"2.5px"} width={18} />
              <span className="ml-2">Lead Magnet</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
