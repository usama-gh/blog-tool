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
    <div className={`${className} relative w-full h-500`} style={{
      backgroundImage: `url(${style?.bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div
       style={{
        backgroundColor: style?.bgColor, // Use the provided RGBA value
        opacity: isDefultStyle("bg", style?.bgColor as string) ? 0 : 0.8, // Adjust overlay opacity
      }}
        className={`absolute top-0 left-0 w-full h-full ${
          isDefultStyle("bg", style?.bgColor as string) ? "" : "bg-" + style?.bgColor
        }}`} // Adjust overlay opacity
      ></div>
    
      {/* Content */}
      {children}
    </div>
    
    
  );
}
