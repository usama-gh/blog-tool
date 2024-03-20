import { isDefultStyle } from "@/lib/utils";
import { SlideStyle } from "@/types";

export default function ContentCustomizer({
  style,
  className,
  children,
}: {
  style: SlideStyle | undefined;
  className:string
  children: React.ReactNode;
}) {
  return (
    <div
      // className="relative min-h-[500px] w-full max-w-screen-xl  snap-center rounded-lg bg-slate-100  p-8  dark:border-gray-700  dark:bg-gray-950  lg:mt-0"
      className={className}
      style={{
        backgroundImage: `url(${style?.bgImage})`,
        backgroundColor: isDefultStyle("bg", style?.bgColor as string)
          ? ""
          : style?.bgColor,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "500px",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
