import {
    ColumnDef, RowData, RowSelectionState, Updater,
    flexRender, getCoreRowModel,
    useReactTable
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Label } from "@/lib/api_utils/label"

declare module '@tanstack/table-core' {
    interface TableMeta<TData extends RowData> {
        onDataChange: () => void
        labels: Label[] | undefined
    }
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    labels?: Label[]
    state: { rowSelection: RowSelectionState }
    onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void
    onDataChange: () => void
}

function DataTable<TData, TValue>({
    columns,
    data,
    labels,
    state,
    onRowSelectionChange,
    onDataChange
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: onRowSelectionChange ?? undefined,
        state: state,
        meta: {
            onDataChange: onDataChange,
            labels: labels ?? undefined
        }
    })

    return (
        <div className="rounded-md border max-width-full overflow-x-auto">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default DataTable
