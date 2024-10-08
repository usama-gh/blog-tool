import { BubbleMenu, BubbleMenuProps } from "@tiptap/react";
import { FC, useState } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  AlignCenter,
  AlignRight,
  AlignLeft,
} from "lucide-react";

import { NodeSelector } from "./node-selector";
import { cn } from "@/lib/utils";
import { LinkSelector } from "./link-selector";
import { ColorSelector } from "./color-selector";

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: typeof BoldIcon;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      // @ts-ignore
      isActive: () => props.editor.isActive("bold"),
      // @ts-ignore
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      // @ts-ignore
      isActive: () => props.editor.isActive("italic"),
      // @ts-ignore
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      // @ts-ignore
      isActive: () => props.editor.isActive("underline"),
      // @ts-ignore
      command: () => props.editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      // @ts-ignore
      isActive: () => props.editor.isActive("strike"),
      // @ts-ignore
      command: () => props.editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      // @ts-ignore
      isActive: () => props.editor.isActive("code"),
      // @ts-ignore
      command: () => props.editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
    {
      name: "left-align",
      // @ts-ignore
      isActive: () => props.editor.isActive({ textAlign: 'left' }),
      // @ts-ignore
      command: () => props.editor.chain().focus().setTextAlign('left').run(),
      icon: AlignLeft,
    },
    {
      name: "center-align",
      // @ts-ignore
      isActive: () => props.editor.isActive({ textAlign: 'center' }),
      // @ts-ignore
      command: () => props.editor.chain().focus().setTextAlign('center').run(),
      icon: AlignCenter,
    },
    {
      name: "right-align",
      // @ts-ignore
      isActive: () => props.editor.isActive({ textAlign: 'right' }),
      // @ts-ignore
      command: () => props.editor.chain().focus().setTextAlign('right').run(),
      icon: AlignRight,
    },
    
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      // don't show if image is selected
      if (editor.isActive("image")) {
        return false;
      }
      return editor.view.state.selection.content().size > 0;
    },
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
      onHidden: () => {
        setIsNodeSelectorOpen(false);
        setIsColorSelectorOpen(false);
        setIsLinkSelectorOpen(false);
      },
    },
  };

  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="flex rounded  bg-white shadow-xl whitespace-nowrap max-w-[250px] flex-wrap justify-center w-max"
    >
      <NodeSelector
        // @ts-ignore
        editor={props.editor}
        isOpen={isNodeSelectorOpen}
        setIsOpen={() => {
          setIsNodeSelectorOpen(!isNodeSelectorOpen);
          setIsColorSelectorOpen(false);
          setIsLinkSelectorOpen(false);
        }}
      />

      <LinkSelector
        // @ts-ignore
        editor={props.editor}
        isOpen={isLinkSelectorOpen}
        setIsOpen={() => {
          setIsLinkSelectorOpen(!isLinkSelectorOpen);
          setIsColorSelectorOpen(false);
          setIsNodeSelectorOpen(false);
        }}
      />

      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.command}
          className="p-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
        >
          <item.icon
            className={cn("h-4 w-4", {
              "text-blue-500": item.isActive(),
            })}
          />
        </button>
      ))}

      <ColorSelector
        // @ts-ignore
        editor={props.editor}
        isOpen={isColorSelectorOpen}
        setIsOpen={() => {
          setIsColorSelectorOpen(!isColorSelectorOpen);
          setIsLinkSelectorOpen(false);
          setIsNodeSelectorOpen(false);
        }}
      />
    </BubbleMenu>
  );
};
