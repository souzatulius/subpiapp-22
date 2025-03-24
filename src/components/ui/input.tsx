
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-subpi-gray-text shadow-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
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
