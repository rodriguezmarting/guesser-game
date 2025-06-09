import { cn } from "~/lib/utils";

type CellProps = {
  title: string;
  status: "right" | "wrong" | "partial";
  index: number;
};

function getFontSizeClass(text: string): string {
  const wordCount = text.split(/\s+/).length;
  const charCount = text.length;
  const longestWord = text
    .split(/\s+/)
    .reduce((a, b) => (a.length > b.length ? a : b), "");

  // If a single word is long (like "Unknown" or longer), shrink font
  if (longestWord.length > 6) {
    return "text-[10px] leading-tight";
  }
  if (wordCount > 3 || charCount > 20) {
    return "text-[10px] leading-tight";
  } else if (wordCount > 2 || charCount > 15) {
    return "text-[11px] leading-tight";
  }
  return "text-xs";
}

export function Cell({ title, status, index }: CellProps) {
  const fontSizeClass = getFontSizeClass(title);

  return (
    <div className="relative w-16 h-16">
      <div
        className={cn(
          "relative w-16 h-16 transition-all duration-500 [transform-style:preserve-3d]",
          "animate-flip"
        )}
        style={{ animationDelay: `${index * 200}ms` }}
      >
        {/* Front of card (empty) */}
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <img
            src="/images/avatar-emblem.avif"
            alt="Avatar Emblem"
            className="shadow-md p-1 w-full h-full border-[1px] border-content rounded-sm"
          />
        </div>

        {/* Back of card (with status) */}
        <div
          className={cn(
            "absolute w-16 h-16 [backface-visibility:hidden] [transform:rotateY(180deg)]",
            "flex justify-center items-center shadow-md border-[1px] border-content rounded-sm",
            status === "right"
              ? "bg-[#514A05]"
              : status === "wrong"
              ? "bg-[#92120a]"
              : "bg-[#ffa500]"
          )}
        >
          <span
            className={cn(
              "flex justify-center items-center w-[99%] h-[99%] border-white text-white border-[1px] rounded-sm",
              "px-1 text-center break-words",
              fontSizeClass
            )}
          >
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}
