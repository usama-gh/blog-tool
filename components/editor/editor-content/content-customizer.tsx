import { isDefultStyle } from "@/lib/utils";
import { SlideStyle } from "@/types";
import BlurImage from "@/components/blur-image";
import Image from "next/image";

export default function ContentCustomizer({
  style,
  className,
  children,
}: {
  style: SlideStyle | undefined;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${className} relative w-full`}>
      {style?.bgImage && (
        <Image
          alt="Mountains"
          src={style?.bgImage}
          quality={100}
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
      )}

      <div
        style={{
          ...(isDefultStyle("bg", style?.bgColor as string)
            ? {}
            : {
                backgroundColor: style?.bgColor, // Use the provided RGBA value
                opacity: style?.bgImage ? 0.8 : 1, // Adjust overlay opacity
              }),
        }}
        className={`absolute left-0 top-0 h-full w-full ${
          isDefultStyle("bg", style?.bgColor as string)
            ? ""
            : "bg-" + style?.bgColor
        }}`} // Adjust overlay opacity
      ></div>

      {/* Content */}
      <div className="max-h-[500px] overflow-y-auto">{children}</div>
    </div>
  );
}
