"use client";

import { useModal } from "@/components/modal/provider";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
export default function PageButton({
  btnText,
  style,
  disable,
  children,
}: {
  btnText: any;
  style?: string | null;
  disable?: boolean;
  children: ReactNode;
}) {
  const modal = useModal();

  return (
    <>
      <Button
        onClick={() => modal?.show(children)}
        variant="secondary"
        disabled={disable}
      >
        {btnText === "Update" ? (
          <Pencil width={18} />
        ) : (
          <>
            <Plus className="mr-2" width={18} />
            {btnText}
          </>
        )}
      </Button>
    </>
  );
}
