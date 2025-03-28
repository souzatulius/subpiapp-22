
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-subpi-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-subpi-blue text-white hover:bg-subpi-blue-dark shadow-md hover:shadow-lg",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
        outline:
          "border border-gray-300 bg-white hover:bg-gray-50 text-subpi-gray-text hover:text-subpi-blue",
        secondary:
          "bg-gray-100 text-subpi-gray-text hover:bg-gray-200",
        ghost: "hover:bg-gray-100 text-subpi-gray-text hover:text-subpi-blue",
        link: "text-subpi-blue underline-offset-4 hover:underline hover:text-subpi-blue-light",
        action: "bg-subpi-orange text-white hover:bg-subpi-orange-dark shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-12 px-5 py-3 rounded-xl",
        sm: "h-10 rounded-xl px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-lg",
        icon: "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  // Note: The Button component doesn't support an 'as' prop
  // For navigation buttons, wrap a Button inside a Link component instead
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
