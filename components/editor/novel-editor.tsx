"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { EditorBubbleMenu } from "./bubble-menu";
import { useEffect, useRef, useState } from "react";
import { TiptapExtensions } from "./extensions";
import { TiptapEditorProps } from "./props";
import { TiptapExtensionsAI } from "./extensions/index-ai";
import { useCompletion } from "ai/react";
import { toast } from "sonner";

export default function NobelEditor({
  text,
  setText,
  canUseAI,
}: {
  text: string;
  setText: any;
  canUseAI?: boolean;
}) {
  const [hydrated, setHydrated] = useState(false);
  const editor = useEditor({
    extensions: canUseAI ? TiptapExtensionsAI : TiptapExtensions,
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
        complete(`bio: ${text}\n\n ${e.editor.getText()}`);
        // complete(e.editor.storage.markdown.getMarkdown());
      } else {
        setText(e.editor.storage.markdown.getMarkdown());
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
        complete(`bio: ${text}\n\n ${editor?.getText()}`);
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
  }, [stop, isLoading, editor, complete, completion.length, text]);

  // Hydrate the editor with the content
  useEffect(() => {
    if (editor && text && !hydrated) {
      editor.commands.setContent(text);
      setHydrated(true);
    }
  }, [editor, hydrated, text]);

  return (
    <>
      {editor && <EditorBubbleMenu editor={editor} />}
      <EditorContent
        className="w-full max-w-md rounded-md border border-gray-300 px-4 py-1 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
        editor={editor}
      ></EditorContent>
    </>
  );
}
