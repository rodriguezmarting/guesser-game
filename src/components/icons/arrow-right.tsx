import { cn } from "~/lib/utils";

interface ArrowRightIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function ArrowRightIcon({ className, ...props }: ArrowRightIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      {...props}
    >
      <path d="M5 12h14M13 18l6-6M13 6l6 6" />
    </svg>
  );
}
