import { Table as MyTable } from "@/components/ui/table";
import { Frown } from "lucide-react";
import { ReactNode } from "react";
import { TableBody, TableHead, TableHeader, TableRow } from "./ui/table";

interface Props {
  columns: { label: string; className?: string }[];
  data: any[];
  renderRows: (item: any, index?: number) => ReactNode;
  noDataMessage?: string;
}

const Table = ({
  columns,
  data,
  renderRows,
  noDataMessage = "No Data Available",
}: Props) => {
  return (
    <>
      <MyTable>
        <TableHeader>
          <TableRow className="text-gray-500 text-sm text-right">
            {columns.map((column, index) => (
              <TableHead key={index} className={`${column.className}`}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="text-gray-800">
          {data?.map((data, index) => renderRows(data, index))}
        </TableBody>
      </MyTable>

      {data.length < 1 && (
        <div className="py-20 text-gray-500 flex flex-col gap-3 justify-center items-center text-sm">
          <Frown size={80} className="text-gray-400" strokeWidth={1.5} />
          {noDataMessage}
        </div>
      )}
    </>
  );
};

export default Table;
