import { cn } from "~/lib/utils";

type CellProps = {
  title: string;
  status: "right" | "wrong" | "partial";
  index: number;
};

export function Cell({ title, status, index }: CellProps) {
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
          <span className="flex justify-center items-center w-[99%] h-[99%] border-white text-white border-[1px] rounded-sm text-xs">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}
