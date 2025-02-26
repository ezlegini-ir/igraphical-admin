import React, { ReactNode } from "react";
import { TableBody, TableHead, TableHeader, TableRow } from "./ui/table";
import { Table as MyTable } from "@/components/ui/table";
import { ChevronsUpDown, Frown } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface Props {
  columns: { label: string; className?: string }[];
  data: any[];
  renderRows: (item: any) => ReactNode;
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
                {/* <Link href={`?sort=${column.label}`}>
                  <Button
                    variant={"link"}
                    className="p-0 gap-0 text-gray-500 hover:text-primary"
                  >
                    <ChevronsUpDown className="scale-75" /> {column.label}
                  </Button>
                </Link> */}
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>{data?.map((data) => renderRows(data))}</TableBody>
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
