import { cn } from "@/utils/cn"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md dark:bg-gray-400 bg-muted", className)}
            {...props}
        />
    )
}

export { Skeleton }
