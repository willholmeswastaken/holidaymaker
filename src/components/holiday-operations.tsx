"use client"

import * as React from "react"
import Link from "next/link"
import { Icons } from "@/components/icons"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type HolidayWithPhotoViewModel } from "@/types/HolidayWithPhoto"
import { api } from "@/utils/api"

interface HolidayOperationsProps {
    holiday: Pick<HolidayWithPhotoViewModel, "id" | "title">
    onHolidayRemoved?: () => void;
}

export function HolidayOperations({ holiday, onHolidayRemoved }: HolidayOperationsProps) {
    const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
    const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)
    const trpcCtx = api.useContext();
    const removeHolidayMutation = api.holiday.removeHoliday.useMutation({
        onMutate: () => {
            setIsDeleteLoading(true);
        },
        onSuccess: async () => {
            setIsDeleteLoading(false);
            await trpcCtx.holiday.getHolidays.invalidate();
        }
    });

    const onRemoveHoliday = () => {
        removeHolidayMutation.mutate({ id: holiday.id });
        onHolidayRemoved?.();
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border dark:border-slate-700 bg-white dark:hover:bg-slate-800 dark:hover:border-none dark:hover:text-white   transition-colors hover:bg-slate-50">
                    <Icons.ellipsis className="h-4 w-4" />
                    <span className="sr-only">Open</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Link href={`/holiday/${holiday.id}`} className="flex w-full">
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center text-red-600 focus:bg-red-50"
                        onSelect={() => setShowDeleteAlert(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this holiday?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 focus:ring-red-600"
                            onClick={onRemoveHoliday}
                        >
                            {isDeleteLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.trash className="mr-2 h-4 w-4" />
                            )}
                            <span>Delete</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
