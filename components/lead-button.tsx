"use client";

import { useModal } from "@/components/modal/provider";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Magnet } from "lucide-react";

export default function LeadButton({
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
 <Magnet className="mr-2"
            width={18} /> {btnText}
          </Button>
      
    </>
  );
}
