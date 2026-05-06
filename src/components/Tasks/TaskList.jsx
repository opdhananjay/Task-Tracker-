import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { BookOpenText, Bug, ChartColumnBig, Equal, Info, Timer, TimerOff, User } from "lucide-react";
import { useState } from "react";

const columneHelper = createColumnHelper();

const columns = [

    columneHelper.accessor('id',{
        cell:(info) => info.getValue(),
        header:() => (
            <span className="flex items-center">
                 <User className='mr-2' size={16}/> ID
            </span>
        )
    }),

    columneHelper.accessor('title',{
        cell:(info) => info.getValue(),
        header: () => (
            <span className="flex items-center">
                <BookOpenText className="mr-2" size={16} />
                Title
            </span>
        )
    }),

    columneHelper.accessor('developer',{
        cell:(info) => info.getValue(),
        header:()=>(
            <span className="flex items-center">
                <Equal className="mr-2" size={16} /> Developer
            </span>
        )
    }),

    columneHelper.accessor('tester',{
        cell:(info) => info.getValue(),
        header:() => (
            <span className="flex items-center">
                <Equal className="mr-2" size={16} /> Tester
            </span>
        )
    }),

    columneHelper.accessor('startdatetime',{
        cell:(info) => info.getValue(),
        header: () => (
            <span className="flex items-center">
                <Timer className="mr-2" size={16} /> Start DateTime 
            </span>
        )
    }),

     columneHelper.accessor('duedatetime',{
        cell:(info) => info.getValue(),
        header: () => (
            <span className="flex items-center">
                <TimerOff className="mr-2" size={16} /> Due DateTime 
            </span>
        )
    }),

    columneHelper.accessor('priority',{
        cell:(info) => info.getValue(),
        header: () => (
            <span className="flex items-center">
                <Info className="mr-2" size={16} /> Priority 
            </span>
        )
    }),

    columneHelper.accessor('status',{
        cell:(info) => info.getValue(),
        header: () => (
            <span className="flex items-center">
                <ChartColumnBig className="mr-2" size={16} /> Status 
            </span>
        )
    }),

    columneHelper.accessor('unittesting',{
        cell:(info)=> info.getValue(),
        header:() => (
            <span className="flex items-center">
                <Bug className="mr-2" size={16} /> Unit Testing 
            </span>
        )
    })

]

const TaskList = () => {

    const [data, setData] = useState([
        {
            id: 1,
            title: "Login API",
            developer: "Dhananjay",
            tester: "Rahul",
            startdatetime: "2026-05-01",
            duedatetime: "2026-05-05",
            priority: "High",
            status: "In Progress",
            unittesting: "Done"
        }
    ]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel:getCoreRowModel()
    });

    console.log('row',table.getHeaderGroups())

    return (
        <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">

                <table className="min-w-full divide-y divide-gray-200">
                    
                    <thead className="bg-gray-50">
                        {
                            table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                     {
                              headerGroup.headers.map((header) => (
                               <th
                                    key={header.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                              ))
                            }
                                </tr>
                            ))
                        }
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            table.getRowModel().rows.map((row)=>(
                                <tr key={row.id}>
                                    {
                                        row.getVisibleCells().map((cell)=>(
                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {flexRender(cell.column.columnDef.cell,cell.getContext())}
                                            </td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>

                </table>

            </div>


        </div>
    )
}

export default TaskList;