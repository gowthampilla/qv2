import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium tracking-normal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-[#E4E4E7]/80 bg-[#F5F5F5] text-[#050505] shadow-[0_0_28px_rgba(212,212,216,0.14)] hover:bg-[#D4D4D8] hover:shadow-[0_0_36px_rgba(212,212,216,0.22)]",
        secondary:
          "border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#BAE6FD] hover:bg-[#38BDF8]/15",
        ghost: "text-muted-foreground hover:bg-[#171717] hover:text-foreground",
        outline:
          "border border-border bg-[#0A0A0A] text-[#F5F5F5] hover:border-[#D4D4D8]/45 hover:bg-[#171717]"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
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
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
