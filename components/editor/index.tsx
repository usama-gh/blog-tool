"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import nlp from "compromise";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import { useDebounce } from "use-debounce";
import { useCompletion } from "ai/react";
import PostForm from "@/components/form/post-form";
import { toast } from "sonner";
import TextareaAutosize from "react-textarea-autosize";
import { EditorBubbleMenu } from "./bubble-menu";
import { Lead, Post } from "@prisma/client";
import { updatePost, updatePostMetadata } from "@/lib/actions";
import {
  cn,
  convertToRgba,
  createGateSlide,
  isDefultStyle,
  styledSlide,
} from "@/lib/utils";
import LoadingDots from "../icons/loading-dots";
import { ExternalLink } from "lucide-react";
import { EditorContents } from "./editor-content";
import ImportJSONButton from "../import-json-btn";
import ImportJsonModal from "../modal/import-json";
import { TiptapExtensionsAI } from "./extensions/index-ai";
import { markdownToTxt } from "markdown-to-txt";
import Form from "@/components/form";
import { triggerEvent } from "../usermaven";
import LeadButton from "../lead-button";
import LinkLeadModal from "../modal/link-lead";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SlideCustomizer from "../slide-customizer";
import { SlideStyle, gateSlide } from "@/types";
import ContentCustomizer from "./editor-content/content-customizer";
import ShowSlides from "./show-slides";
import AddSlide from "./add-slide";

type PostWithSite = Post & { site: { subdomain: string | null } | null };

export default function Editor({
  post,
  canUseAI,
  leads,
}: {
  post: PostWithSite;
  canUseAI: boolean;
  leads: Lead[];
}) {
  const router = useRouter();

  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  let [isPendingLead, startTransitionLead] = useTransition();

  const [data, setData] = useState<PostWithSite>(post);
  const [hydrated, setHydrated] = useState(false);
  const [textareaValue, setTextareaValue] = useState<string>(
    post?.description || "",
  );
  const [isUserEdit, setIsUserEdit] = useState<boolean>(false);
  const [isPasted, setIsPasted] = useState<boolean>(false);
  const [leadId, setLeadId] = useState(data.leadId);

  const firstRender = useRef<boolean>(true);
  const firstRenderLead = useRef<boolean>(true);
  const MAX_CHUNK_LENGTH =
    Number(process.env.NEXT_PUBLIC_MAX_CHUNK_LENGTH) || 300;

  const [slidesStyles, setSlidesStyles] = useState<SlideStyle[] | []>(() => {
    try {
      return !!data.styling ? JSON.parse(data.styling) : [];
    } catch (error) {
      console.error("Error parsing slides styling JSON:", error);
      return [];
    }
  });
  const [gateSlides, setGateSlides] = useState<gateSlide[] | []>(() => {
    try {
      return !!data.gateSlides ? JSON.parse(data.gateSlides) : [];
    } catch (error) {
      console.error("Error parsing gate slides JSON:", error);
      return [];
    }
  });

  useEffect(() => {
    // @ts-ignore
    if (post && post.content) {
      let abc = post?.content;
      // @ts-ignore
      abc = abc?.replace(/!\[.*\]\(.*\)/g, "");
      // @ts-ignore
      let plainText =
        markdownToTxt(abc as string)
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
      let abc = post?.content;
      // @ts-ignore
      abc = abc?.replace(/!\[.*\]\(.*\)/g, "");
      // @ts-ignore
      if (abc) {
        let plainText = markdownToTxt(abc)?.replaceAll("\n", " ");
        const first170Characters = plainText?.substring(0, 170) || "";
        if (textareaValue !== first170Characters) {
          setTextareaValue(first170Characters);
          setData({ ...data, description: first170Characters });
        }
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
      debouncedData.slides === post.slides &&
      debouncedData.styling === post.styling &&
      debouncedData.gateSlides === post.gateSlides
    ) {
      return;
    }
    // console.log("170: ", "slides changes");

    startTransitionSaving(async () => {
      await updatePost(debouncedData);
      console.log("174: ", "data updated");
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
        complete(e.editor.getHTML());
      } else {
        setData((prev) => ({
          ...prev,
          content: e.editor.getHTML(),
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
        if (value === "gate") {
          const gateSlide: gateSlide = createGateSlide(index);
          setGateSlides([gateSlide]);
          value =
            "<h1 style='text-align: center'>Subscribe to unlock</h1><p style='text-align: center'>I hope you find my posts valuable. I would love to have you subscribed to my newsletter. By subscribing, you'll unlock exclusive content. Simply enter your email below to continue reading more</p>";
        } else {
          value = "";
        }

        setSlides([...slides, value]);
        toast("Slide added");
        break;
      case "update":
        updatedSlides[index] = value;
        setSlides(updatedSlides);
        break;
      case "delete":
        // setSlides(slides.filter((_: string, idx: number) => idx != index));

        const slideStyle: SlideStyle | undefined = slidesStyles.find(
          (slide: SlideStyle) => slide.id == index + 1,
        );

        // delete image if slide style has
        if (slideStyle?.bgImage) {
          await fetch("/api/upload", {
            method: "DELETE",
            body: JSON.stringify({ image: slideStyle.bgImage }),
          });
        }

        updatedSlides.splice(index, 1);
        setSlides(updatedSlides);

        const styledSlides = slidesStyles.filter(
          (slide: SlideStyle) => slide.id != index + 1,
        );
        setSlidesStyles(styledSlides);

        // delete gate slide
        const gatedSlides = gateSlides.filter(
          (slide: gateSlide) => slide.id != index + 1,
        );
        setGateSlides(gatedSlides);

        setData({
          ...data,
          styling: JSON.stringify(styledSlides),
        });

        toast("Slide deleted");
        break;
      default:
        console.log("default handle for handle slide");
        break;
    }
  };

  useEffect(() => {
    setData((state) => {
      return {
        ...state,
        slides: JSON.stringify([...slides]),
        gateSlides: JSON.stringify([...gateSlides]),
      };
    });
  }, [slides, gateSlides]);

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
    // const MAX_CHUNK_LENGTH = 300;
    const sentences = nlp(text).sentences().out("array");
    const chunks = [];
    let currentChunk = "";

    sentences.forEach((sentence: string) => {
      const sentenceWithSpace = sentence + " ";
      if (currentChunk.length + sentenceWithSpace.length <= MAX_CHUNK_LENGTH) {
        currentChunk += sentenceWithSpace;
      } else {
        if (currentChunk.trim() !== "") {
          chunks.push(currentChunk.trim().replace(/\\/g, "\n"));
        }
        currentChunk = sentenceWithSpace;
      }
    });

    if (currentChunk.trim() !== "") {
      chunks.push(currentChunk.trim().replace(/\\/g, "\n"));
    }

    return chunks.map((chunk, index) => ({ id: index + 1, content: chunk }));
  };

  // Split the content into slides
  const splitContentIntoSlides = async (splitContent: any) => {
    const slides = splitContent.slice(1).map((item: any) => item.content);
    setSlideWithJson(slides, splitContent[0].content);
  };

  const showSplitToast = () => {
    let splitContent = splitTextIntoChunks(debouncedData.content as string);

    if (splitContent.length > 1) {
      toast("Want to split your post?", {
        action: {
          label: "Yes",
          onClick: () => splitContentIntoSlides(splitContent),
        },
        duration: 6000,
      });
    }
  };

  // Showing split toast to user
  useEffect(() => {
    if (debouncedData.content && isPasted) {
      // showSplitToast();
      let splitContent = splitTextIntoChunks(debouncedData.content as string);

      if (splitContent.length > 1) {
        toast("Want to split your post?", {
          action: {
            label: "Yes",
            onClick: () => splitContentIntoSlides(splitContent),
          },
          duration: 6000,
        });
      }
      setIsPasted(false);
    }
  }, [debouncedData.content]);

  useEffect(() => {
    if (!firstRenderLead.current) {
      const formData = new FormData();
      // @ts-ignore
      formData.append("leadId", leadId);
      startTransitionLead(async () => {
        await updatePostMetadata(formData, post.id, "leadId").then(() => {
          router.refresh();
          toast.success(
            `Successfully ${leadId ? " created " : "removed"} lead magnet ${
              leadId ? "to" : "from"
            } post`,
          );
          setData((prev) => ({
            ...prev,
            leadId: leadId,
          }));
        });
      });
    }
    firstRenderLead.current = false;
  }, [leadId]);

  function updateStyleSlides(index: number, style: any) {
    const updatedSlides = slidesStyles.map((slide: SlideStyle) =>
      slide.id == index
        ? {
            ...slide,
            ...style,
          }
        : slide,
    );

    setSlidesStyles(updatedSlides);
    setData((prev) => ({ ...prev, styling: JSON.stringify(updatedSlides) }));
  }

  // for slides styles
  useEffect(() => {
    // checkecking for content slide
    const contentSlide: SlideStyle | undefined = slidesStyles.find(
      (item: SlideStyle) => item.id == 0,
    );
    if (!contentSlide) {
      const slide: SlideStyle = styledSlide(0);
      setSlidesStyles([...slidesStyles, slide]);
    }

    slides.map((slideData: string, index: number) => {
      const slideStyle: SlideStyle | undefined = slidesStyles.find(
        (item: SlideStyle) => item.id == index + 1,
      );

      if (!slideStyle) {
        const slideStyle: SlideStyle = styledSlide(index + 1);
        setSlidesStyles([...slidesStyles, slideStyle]);
      }
    });
  }, [slides, slidesStyles]);

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
        {/* <ImportJSONButton>
          <ImportJsonModal setSlideWithJson={setSlideWithJson} />
        </ImportJSONButton> */}
        <div className="rounded-lg px-2 py-1 text-xs tracking-widest text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          {isPendingSaving ? "Saving..." : "SAVED"}
        </div>
        <LeadButton
          btnText={isPendingLead ? <LoadingDots /> : "Lead Magnet"}
          style="rounded-lg  shadow-lg bg-slate-200 px-4 py-1 text-xs font-normal text-slate-700 dark:bg-black dark:text-gray-500 lg:text-lg border-gray-100 shadow-none"
          disable={isPendingLead ? true : false}
        >
          <LinkLeadModal leads={leads} leadId={leadId} setLeadId={setLeadId} />
        </LeadButton>

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
                  triggerEvent("published_post", {});
                  setData((prev) => ({
                    ...prev,
                    published: !prev.published,
                  }));
                },
              );
            });
          }}
          className={cn(
            "flex items-center justify-center space-x-2 rounded-lg border px-5 py-1  text-xs transition-all focus:outline-none lg:text-lg",
            isPendingPublishing || debouncedData.content === ""
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              : "border border-slate-700 bg-slate-700 text-white hover:bg-white hover:text-black active:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-gray-800",
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

      <input
        type="text"
        placeholder="Title"
        defaultValue={post?.title || ""}
        autoFocus
        onChange={(e) => setData({ ...data, title: e.target.value })}
        className="dark:placeholder-text-600 font-inter mb-2 w-full rounded-md border-none bg-slate-100 px-8 py-4 text-3xl font-bold placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:bg-black dark:bg-gray-900/80 dark:text-white"
      />

      <div className="flex w-full flex-col items-center justify-center">
        <div className="scroll-x-fade carousel-wrapper mb-2 mt-2 flex w-full flex-nowrap space-x-4 overflow-x-scroll pb-4">
          <div className="animate-fadeLeft carousel-item carousel-item min-h-[500px] w-[90%]  flex-shrink-0 overflow-y-auto">
            <ContentCustomizer
              style={slidesStyles.find((item: SlideStyle) => item.id == 0)}
              className="relative h-full max-w-screen-xl overflow-y-auto  rounded-lg bg-slate-100 p-8 dark:bg-gray-900/80 lg:mt-0"
            >
              {editor && <EditorBubbleMenu editor={editor} />}
              <div onPasteCapture={() => setIsPasted(true)}>
                <EditorContent editor={editor} />
              </div>
              <SlideCustomizer
                slidesStyles={slidesStyles}
                index={0}
                updateStyleSlides={updateStyleSlides}
                editor={editor}
              />
            </ContentCustomizer>
          </div>

          {/* showing slides data */}
          <ShowSlides
            data={data}
            post={post}
            slides={slides}
            setData={setData}
            updateSlides={updateSlides}
            canUseAI={canUseAI}
            slidesStyles={slidesStyles}
            updateStyleSlides={updateStyleSlides}
            gateSlides={gateSlides}
            setGateSlides={setGateSlides}
          />

          {/* add new slide */}
          <AddSlide updateSlides={updateSlides} index={slides.length + 1} />
        </div>
      </div>

      <div className="flex snap-x snap-proximity overflow-x-auto">
        <div className="mb-4 flex w-full justify-end"></div>
      </div>

      <div className="grid w-full grid-cols-1 gap-x-2 gap-y-2 lg:grid-cols-3">
        <div className="rounded-lg bg-slate-100 dark:bg-gray-900/80">
          <div className="relative flex flex-col space-y-4 p-2 lg:p-10">
            <div className="flex justify-between">
              <h2 className="font-inter text-xl font-semibold text-slate-500 dark:text-white">
                SEO description
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400">
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
        <div>
          <Form
            title="Post thumbnail"
            description="Accepted formats: .png, .jpg, .jpeg"
            helpText=""
            inputAttrs={{
              name: "image",
              type: "file",
              defaultValue: data?.image!,
            }}
            handleSubmit={updatePostMetadata}
          />
        </div>
      </div>
    </>
  );
}
