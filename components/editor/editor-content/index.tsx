import { EditorContent, useEditor } from "@tiptap/react";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { TiptapExtensions } from "../extensions";
import { TiptapEditorProps } from "../props";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { Post } from "@prisma/client";
import { EditorBubbleMenu } from "../bubble-menu";
import { TiptapExtensionsAI } from "../extensions/index-ai";
import SlideCustomizer from "@/components/slide-customizer";
import { SlideStyle } from "@/types";

type PostWithSite = Post & { site: { subdomain: string | null } | null };

interface Props {
  index: number;
  data: any;
  post: any;
  setData: Dispatch<SetStateAction<PostWithSite>>;
  updateSlides: any;
  slides: Array<string>;
  slideData: string;
  canUseAI: boolean;
  slidesStyles: SlideStyle[] | [];
  updateStyleSlides: any;
}

export const EditorContents = (props: Props) => {
  const editor = useEditor({
    extensions: props.canUseAI ? TiptapExtensionsAI : TiptapExtensions,
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      const selection = e.editor.state.selection;
      const lastTwo = e.editor.state.doc.textBetween(
        selection.from - 2,
        selection.from,
        "\n",
      );
      if (lastTwo === "++" && !isLoading) {
        e.editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        // we're using this for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
        complete(
          `Title: ${props.data.title}\n Description: ${
            props.data.description
          }\n\n ${e.editor.getText()}`,
        );
        // complete(e.editor.storage.markdown.getMarkdown());
      } else {
        props.setData({
          ...props.data,
          slides: JSON.stringify([...props.slides]),
        });
        props.updateSlides(
          "update",
          Number(props.index),
          e.editor.storage.markdown.getMarkdown(),
        );
      }
    },
  });

  const { complete, completion, isLoading, stop } = useCompletion({
    id: "novel",
    api: "/api/generate",
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  useEffect(() => {
    // if user presses escape or cmd + z and it's loading,
    // stop the request, delete the completion, and insert back the "++"
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
        stop();
        if (e.key === "Escape") {
          editor?.commands.deleteRange({
            from: editor.state.selection.from - completion.length,
            to: editor.state.selection.from,
          });
        }
        editor?.commands.insertContent("++");
      }
    };
    const mousedownHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      if (window.confirm("AI writing paused. Continue?")) {
        complete(
          `Title: ${props.data.title}\n Description: ${
            props.data.description
          }\n\n ${editor?.getText() || " "}`,
        );
      }
    };
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("mousedown", mousedownHandler);
    } else {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    };
  }, [
    stop,
    isLoading,
    editor,
    complete,
    completion.length,
    props.data.title,
    props.data.description,
  ]);

  // Hydrate the editor with the content
  useEffect(() => {
    if (editor?.isEmpty) editor.commands.setContent(props.slideData);
  }, [editor, props.slideData]);

  return (
    <>
      {editor && <EditorBubbleMenu editor={editor} />}
      <EditorContent editor={editor}></EditorContent>
      <SlideCustomizer
        slidesStyles={props.slidesStyles}
        index={props.index + 1}
        updateStyleSlides={props.updateStyleSlides}
        editor={editor}
      />
    </>
  );
};
