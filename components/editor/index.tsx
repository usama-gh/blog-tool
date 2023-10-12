"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import nlp from 'compromise'
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import { useDebounce } from "use-debounce";
import { useCompletion } from "ai/react";
import PostForm from "@/components/form/post-form";
import { toast } from "sonner";
import TextareaAutosize from "react-textarea-autosize";
import { EditorBubbleMenu } from "./bubble-menu";
import { Post } from "@prisma/client";
import { updatePost, updatePostMetadata } from "@/lib/actions";
import { cn } from "@/lib/utils";
import LoadingDots from "../icons/loading-dots";
import { ExternalLink, PlusCircleIcon, XCircle } from "lucide-react";
import { EditorContents } from "./editor-content";
import ImportJSONButton from "../import-json-btn";
import ImportJsonModal from "../modal/import-json";
import { TiptapExtensionsAI } from "./extensions/index-ai";
import { markdownToTxt } from "markdown-to-txt";

type PostWithSite = Post & { site: { subdomain: string | null } | null };

export default function Editor({
  post,
  canUseAI,
}: {
  post: PostWithSite;
  canUseAI: boolean;
}) {
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();

  const [textareaValue, setTextareaValue] = useState<string>(
    post?.description || "",
  );
  const [isUserEdit, setIsUserEdit] = useState<boolean>(false);
  const firstRender = useRef<boolean>(true);
  const MAX_CHUNK_LENGTH =
    Number(process.env.NEXT_PUBLIC_MAX_CHUNK_LENGTH) || 300;

  useEffect(() => {
    // @ts-ignore
    if (post && post.content) {
      let plainText =
        markdownToTxt(post?.content as string)
          ?.replaceAll("\n", " ")
          ?.substring(0, 170) || "";

      if (post.description !== plainText) {
        setIsUserEdit(true);
      }
    }
  }, []);

  useEffect(() => {
    // Update textareaValue whenever post.content changes, but only if the user hasn't manually edited it
    if (!firstRender.current && !isUserEdit) {
      // @ts-ignore
      let plainText = markdownToTxt(post?.content)?.replaceAll("\n", " ");
      const first170Characters = plainText?.substring(0, 170) || "";
      if (textareaValue !== first170Characters) {
        setTextareaValue(first170Characters);
        setData({ ...data, description: first170Characters });
      }
    }
    firstRender.current = false;
  }, [post.description, textareaValue, isUserEdit, post.content]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextareaValue(newValue);
    setData({ ...data, description: newValue });

    // Set the isUserEdit flag to true when the user directly edits the textarea
    if (newValue) {
      setIsUserEdit(true);
    } else {
      setIsUserEdit(false);
    }
  };

  const [data, setData] = useState<PostWithSite>(post);
  const [hydrated, setHydrated] = useState(false);
  const [slides, setSlides] = useState<Array<string>>(() => {
    try {
      return !!post.slides ? JSON.parse(post.slides) : [];
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  });

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${post.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/${post.slug}`;

  const [debouncedData] = useDebounce(data, 1000);

  useEffect(() => {
    // compare the title, description and content only
    if (
      debouncedData.title === post.title &&
      debouncedData.description === post.description &&
      debouncedData.content === post.content &&
      debouncedData.slides === post.slides
    ) {
      return;
    }
    console.log("112: ", "slides changes");

    startTransitionSaving(async () => {
      await updatePost(debouncedData);
    });
  }, [debouncedData, post]);

  // listen to CMD + S and override the default behavior
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "s") {
        e.preventDefault();
        startTransitionSaving(async () => {
          await updatePost(data);
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [data, startTransitionSaving]);

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
        complete(
          `Title: ${data.title}\n Description: ${
            data.description
          }\n\n ${e.editor.getText()}`,
        );
        complete(e.editor.storage.markdown.getMarkdown());
      } else {
        setData((prev) => ({
          ...prev,
          content: e.editor.storage.markdown.getMarkdown(),
        }));
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
          `Title: ${data.title}\n Description: ${data.description}\n\n ${
            editor?.getText() || " "
          }`,
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
    data.title,
    data.description,
  ]);

  // Hydrate the editor with the content
  useEffect(() => {
    if (editor && post?.content && !hydrated) {
      editor.commands.setContent(post.content);
      setHydrated(true);
    }
  }, [editor, post, hydrated]);

  const updateSlides = async (action: string, index: number, value: string) => {
    const updatedSlides = slides.slice();

    switch (action) {
      case "add":
        setSlides([...slides, value]);
        break;
      case "update":
        updatedSlides[index] = value;
        setSlides(updatedSlides);
        break;
      case "delete":
        updatedSlides.splice(index, 1);
        setSlides(updatedSlides);
        break;
    }
  };

  useEffect(() => {
    setData((state) => {
      return { ...state, slides: JSON.stringify([...slides]) };
    });
    console.log("hooked called");
  }, [slides]);

  const escapeSpecialCharacters = (str: string) => {
    return str.replace(/[<{]/g, "\\$&");
  };

  const escapeSpecialCharactersInArray = (array: Array<string>) => {
    return array.map((item) => escapeSpecialCharacters(item));
  };

  const setSlideWithJson = (newSlides: Array<string>, content: string) => {
    // Escape < characters in the content
    const escapedContent = escapeSpecialCharacters(content);

    // Escape < characters in the newSlides array
    const escapedSlides = escapeSpecialCharactersInArray(newSlides);

    // Set the slides in JSON format with escaped content
    setData({
      ...data,
      slides: JSON.stringify(escapedSlides),
      content: escapedContent,
    });

    // Set the escaped content in the editor
    editor?.commands.setContent(escapedContent);

    // Set the slides
    setSlides(newSlides);
  };

  // Split the content into required character
  const splitTextIntoChunks = (text: string) => {

    const MAX_CHUNK_LENGTH = 300;
    const sentences = nlp(text).sentences().out('array');
    const chunks = [];
    let currentChunk = '';
    
    
sentences.forEach((sentence: string | any[]) => {
  if ((currentChunk.length + sentence.length) <= MAX_CHUNK_LENGTH) {
    currentChunk += sentence + ' ';
  } else {
    currentChunk = currentChunk.trim();
    chunks.push(currentChunk.replace(/\\/g, '\n').trim());
    currentChunk = sentence + ' ';
  }
});

if (currentChunk.trim().length > 0) {
  chunks.push(currentChunk.replace(/\\/g, '\n').trim());
}

  return chunks.map((chunk, index) => ({ id: index + 1, content: chunk}));
  };

  // Split the content into slides
  const splitContentIntoSlides = async (splitContent: any) => {
    const slides = splitContent.slice(1).map((item: any) => item.content);
    setSlideWithJson(slides, splitContent[0].content);
  };

  // Checking weather user has exceeded the limit of characters or not
  useEffect(() => {
    if(debouncedData.content){
        console.log(debouncedData.content)
    let splitContent = splitTextIntoChunks(debouncedData.content as string);

    if (splitContent.length > 1) {
      toast("Want to split your posts?", {
        action: {
          label: "Yes",
          onClick: () => splitContentIntoSlides(splitContent),
        },
      });
    }
  }
  }, [debouncedData.content]);

  return (
    <>
      <div className="my-5 mb-0 flex items-center justify-end space-x-3 lg:my-0 lg:mb-4">
        {data.published && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-gray-400 hover:text-gray-500"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <ImportJSONButton>
          <ImportJsonModal setSlideWithJson={setSlideWithJson} />
        </ImportJSONButton>
        <div className="rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          {isPendingSaving ? "Saving..." : "Saved"}
        </div>
        <button
          onClick={() => {
            const formData = new FormData();
            formData.append("published", String(!data.published));
            startTransitionPublishing(async () => {
              await updatePostMetadata(formData, post.id, "published").then(
                () => {
                  toast.success(
                    `Successfully ${
                      data.published ? "unpublished" : "published"
                    } your post.`,
                  );
                  setData((prev) => ({
                    ...prev,
                    published: !prev.published,
                  }));
                },
              );
            });
          }}
          className={cn(
            "flex h-7 w-24 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
            isPendingPublishing || debouncedData.content === ""
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              : "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
          )}
          disabled={isPendingPublishing || debouncedData.content === ""}
        >
          {isPendingPublishing ? (
            <LoadingDots />
          ) : (
            <p>{data.published ? "Unpublish" : "Publish"}</p>
          )}
        </button>
      </div>

      <div className="relative mb-5 mt-5 min-h-[320px] w-full max-w-screen-xl border border-gray-200 p-4  dark:border-gray-700 sm:rounded-lg lg:mt-0 lg:p-12">
        <div className="mb-5 flex flex-col space-y-3 border-b border-gray-200 pb-5 dark:border-gray-700">
          <input
            type="text"
            placeholder="Title"
            defaultValue={post?.title || ""}
            autoFocus
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="dark:placeholder-text-600 font-inter border-none px-0 text-3xl font-bold placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
          />
        </div>
        {editor && <EditorBubbleMenu editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      {slides.map((slideData: string, index: number) => (
        <div
          key={`slide-${index}`}
          className="relative mb-5 mt-5 min-h-[300px] w-full max-w-screen-xl border border-gray-200 p-4  dark:border-gray-700 sm:rounded-lg lg:mt-0 lg:p-12"
        >
          <XCircle
            width={24}
            className="absolute right-4 top-4 z-20 cursor-pointer dark:text-white"
            onClick={() => {
              updateSlides("delete", Number(index), "");
            }}
          ></XCircle>
          <EditorContents
            data={data}
            slideData={slideData}
            post={post}
            slides={slides}
            setData={setData}
            updateSlides={updateSlides}
            index={index}
            canUseAI={canUseAI}
          />
        </div>
      ))}
      <div className="mb-4 flex w-full justify-end">
        <button
          type="button"
          onClick={(e) => {
            updateSlides("add", 0, "");
          }}
          className="flex items-center gap-x-2 rounded-full border border-gray-400 px-4 py-1 dark:border-gray-500 dark:text-gray-400"
        >
          Add slide
        </button>
      </div>

      <div className="grid w-full grid-cols-1 gap-x-2 gap-y-2 lg:grid-cols-2">
        <div className="rounded-lg border  border-slate-200 dark:border-gray-700">
          <div className="relative flex flex-col space-y-4 p-2 lg:p-10">
            <div className="flex justify-between">
              <h2 className="font-inter text-xl font-semibold text-slate-500 dark:text-white">
                SEO description
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A small 170 character summary of your blog
            </p>

            <TextareaAutosize
              placeholder="SEO Description"
              value={textareaValue}
              onChange={handleTextareaChange}
              className="w-full max-w-md rounded-md border border-slate-300 bg-transparent text-sm text-slate-900 placeholder-gray-300 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-slate-600 dark:bg-black dark:text-white dark:placeholder-gray-700"
            />
          </div>
        </div>

        <div>
          <PostForm
            title="Post Slug"
            description="Its URL-friendly version of a blog title for searching"
            // helpText="Please use a slug that is unique to this post."
            helpText=""
            inputAttrs={{
              name: "slug",
              type: "text",
              defaultValue: data?.slug!,
              placeholder: "slug",
            }}
            postTitle={debouncedData?.title}
            handleSubmit={updatePostMetadata}
          />
        </div>
      </div>
    </>
  );
}
