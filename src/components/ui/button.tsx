import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold transition-all duration-150 ease-in-out hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-[#003570] text-white hover:bg-[#002855] focus-visible:ring-[#0066cc]',
        action: 'bg-[#f57737] text-white hover:bg-[#e56726] focus-visible:ring-[#fca96d]',
        outline: 'border border-gray-300 text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-300',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-300',
        ghost: 'bg-transparent text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-300',
        destructive: 'bg-[#ea384c] text-white hover:bg-red-600 focus-visible:ring-red-300',
        link: 'bg-transparent text-[#003570] underline-offset-4 hover:underline focus-visible:ring-[#003570]'
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-8 text-base',
        icon: 'h-10 w-10 p-0',
        simple: 'px-6 py-3 text-base rounded-lg' // tamanho tipo botão de e-mail
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
