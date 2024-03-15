import { Check, ChevronDown } from "lucide-react";
import type { Dispatch, SetStateAction, FC } from "react";
import { Editor } from "@tiptap/core";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";

export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

interface ColorSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--novel-black)",
  },
  {
    name: "Purple",
    color: "#9333EA",
  },
  {
    name: "Red",
    color: "#E00000",
  },
  {
    name: "Yellow",
    color: "#EAB308",
  },
  {
    name: "Blue",
    color: "#2563EB",
  },
  {
    name: "Green",
    color: "#008A00",
  },
  {
    name: "Orange",
    color: "#FFA500",
  },
  {
    name: "Pink",
    color: "#BA4081",
  },
  {
    name: "Gray",
    color: "#A8A29E",
  },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--novel-highlight-default)",
  },
  {
    name: "Purple",
    color: "var(--novel-highlight-purple)",
  },
  {
    name: "Red",
    color: "var(--novel-highlight-red)",
  },
  {
    name: "Yellow",
    color: "var(--novel-highlight-yellow)",
  },
  {
    name: "Blue",
    color: "var(--novel-highlight-blue)",
  },
  {
    name: "Green",
    color: "var(--novel-highlight-green)",
  },
  {
    name: "Orange",
    color: "var(--novel-highlight-orange)",
  },
  {
    name: "Pink",
    color: "var(--novel-highlight-pink)",
  },
  {
    name: "Gray",
    color: "var(--novel-highlight-gray)",
  },
];

interface ColorSelectorProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ColorSelector: FC<ColorSelectorProps> = ({
  editor,
  open,
  onOpenChange,
}) => {
  // const { editor } = useEditor();

  if (!editor) return null;
  const activeColorItem = TEXT_COLORS.find(({ color }) =>
    editor.isActive("textStyle", { color }),
  );

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
    editor.isActive("highlight", { color }),
  );

  const hanldeClick = (name: string, color: string) => {
    // editor.commands.removeEmptyTextStyle();
    // editor.commands.unsetColor();
    // name !== "Default" &&
    //   editor
    //     .chain()
    //     .setColor(color || "")
    //     .run();
    // editor.commands.setColor(color || "");
    editor.commands.unsetColor();
    editor
      .chain()
      .focus()
      .setColor(color || "")
      .run();
    // console.log(editor.storage.markdown.getMarkdown());
  };
  const handleHighlightColor = (name: string, color: string) => {

    // editor
    // .chain()
    // .focus()
    // .setHighlight(color || "")
    // .run();

  }

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button className="flex h-full items-center gap-1 p-2 text-sm font-medium hover:bg-stone-100 active:bg-stone-200">
          <span
            className="rounded-sm px-1"
            style={{
              color: activeColorItem?.color,
              backgroundColor: activeHighlightItem?.color,
            }}
          >
            A
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        sideOffset={5}
        className="my-1 flex max-h-80 w-48 flex-col  overflow-y-auto rounded border p-1 shadow-xl "
        align="start"
      >
        <div className="flex flex-col bg-white">
          <div className="text-muted-foreground bg-white my-1 px-2 text-sm font-semibold">
            Color
          </div>
          {TEXT_COLORS.map(({ name, color }, index) => (
            <span
              key={index}
              onClick={() => hanldeClick(name, color)}
              className="hover:bg-accent flex cursor-pointer items-center justify-between px-2 py-1 text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-sm border px-2 py-px font-medium"
                  style={{ color }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
            </span>
          ))}
        </div>

        <div className="flex flex-col bg-white">
          <div className="text-muted-foreground bg-white my-1 px-2 text-sm font-semibold">
            Background
          </div>
          {HIGHLIGHT_COLORS.map(({ name, color }, index) => (
            <span
              key={index}
              onClick={() => handleHighlightColor(name, color)}
              className="hover:bg-accent flex cursor-pointer items-center justify-between px-2 py-1 text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-sm border px-2 py-px font-medium"
                  style={{ backgroundColor: color }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
            </span>
          ))}
        </div>



      
      </PopoverContent>
    </Popover>
  );
};
