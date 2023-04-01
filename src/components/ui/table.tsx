import { getCoreRowModel, useReactTable, type ColumnDef, flexRender } from '@tanstack/react-table';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

type Props<T> = {
    data: T[];
    columns: ColumnDef<T, any>[]
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

const Table = <T,>({ data, columns, onEdit, onDelete }: Props<T>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })
    const hasData = data.length > 0;
    return (
        <>
            {
                hasData
                    ? (
                        <table className='w-full'>
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : <span className='capitalize' >{flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}</span>}
                                            </th>
                                        ))}
                                        <th></th>
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id}>
                                                <p>{flexRender(cell.column.columnDef.cell, cell.getContext())}</p>
                                            </td>
                                        ))}
                                        <td className='w-0'>
                                            <button onClick={() => onEdit && onEdit(row.original)} className='mr-2'>
                                                <PencilSquareIcon className='w-5 h-5' />
                                            </button>
                                            <button onClick={() => onDelete && onDelete(row.original)}>
                                                <TrashIcon className='w-5 h-5 text-red-600' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                    : (
                        <p className='self-center text-center text-slate-100'>No data available!</p>
                    )
            }
        </>
    )
}

export default Table