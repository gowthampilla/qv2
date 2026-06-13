import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium tracking-normal transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-[#D4D4D8]/80 bg-[linear-gradient(180deg,#F5F5F5_0%,#D4D4D8_100%)] text-[#050505] shadow-[0_0_34px_rgba(212,212,216,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-[#F5F5F5] hover:shadow-[0_0_44px_rgba(212,212,216,0.24),inset_0_1px_0_rgba(255,255,255,0.9)]",
        secondary:
          "border border-[#38BDF8]/25 bg-[#38BDF8]/[0.08] text-[#BAE6FD] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-[#38BDF8]/[0.13]",
        ghost: "text-muted-foreground hover:bg-[#171717]/80 hover:text-foreground",
        outline:
          "border border-[#2A2A2A] bg-[#0A0A0A]/90 text-[#F5F5F5] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] hover:border-[#D4D4D8]/45 hover:bg-[#171717]"
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
