
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-base shadow-sm transition-all duration-300 hover:border-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        style={{WebkitBoxShadow: "0 0 0 1000px transparent inset"}}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
