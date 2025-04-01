
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base shadow-sm transition-all duration-300 hover:border-gray-600 file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-gray-400 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#003570] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
