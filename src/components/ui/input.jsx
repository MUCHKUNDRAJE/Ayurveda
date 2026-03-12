import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "flex h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none",
                "placeholder:text-muted-foreground",
                "selection:bg-primary selection:text-primary-foreground",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                className
            )}
            {...props}
        />
    )
}

export { Input }
