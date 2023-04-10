import { type Prisma } from "@prisma/client";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Table from "./ui/table";
import { type HolidayWithPhoto } from "@/types/HolidayWithPhoto";

type Props = {
    holidays: HolidayWithPhoto[];
}

export const HolidaysTable = ({ holidays }: Props) => {
    const columnHelper = createColumnHelper<HolidayWithPhoto>()
    const columns = useMemo<ColumnDef<HolidayWithPhoto, any>[]>(() => [
        columnHelper.accessor('title', {
            header: 'Title',
            cell: info => info.getValue() as string,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('locationAddress', {
            header: 'Location',
            cell: info => info.getValue() as string,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('visitedAt', {
            header: 'Visited At',
            cell: info => (info.getValue() as Date).toISOString(),
            footer: info => info.column.id,
        }),
    ], [columnHelper]);
    return (
        <Table<HolidayWithPhoto> data={holidays ?? []} columns={columns} />
    );
}