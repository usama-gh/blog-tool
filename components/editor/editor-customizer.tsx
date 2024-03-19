import { isDefultStyle } from "@/lib/utils";
import { SlideStyle } from "@/types";
import Image from "next/image";

export default function EditorCustomizer({
  style,
}: {
  style: SlideStyle | undefined;
}) {
  return (
    <>
      {style?.bgImage && (
        <Image
          layout="fill"
          //   sizes="(max-width: 768px) 100vw, 33vw"
          className="pointer-events-none object-cover object-center"
          src={style.bgImage}
          alt="image"
          // width={100}
          // height={100}
        />
      )}

      {style?.bgColor && !isDefultStyle("bg", style.bgColor) && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: style.bgColor,
          }}
        />
      )}
    </>
  );
}
