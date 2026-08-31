import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { BookOpenText, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import useDeveloper from "../../hooks/useDeveloper";
import useAuth from "../../hooks/useAuth";
import useMaster from "../../hooks/useMaster";
import { formatDate } from "../../utils/dateUtils";

const ReviewListPage = () => {

    const { getUserFromToken } = useAuth();

    const { fetchDevelopersAndTestersAndOrg, testerMap } = useMaster();

    const { GetTesterTestingLogsList } = useDeveloper();

    const [data,setData] = useState([]);

    const columneHelper = createColumnHelper();

     useEffect(()=>{

        const fetchData = async () => {
            const user = getUserFromToken();
            const orgId = user.organizationId;
            // Fetch Master Lookup
            await fetchDevelopersAndTestersAndOrg(orgId);
            // Then Fetch tasks using orgid
            const response = await GetTesterTestingLogsList(Number(user.userId));
            if(response?.success && response?.data){
                setData(response.data);
            }
        }
        
        fetchData();

    },[]);

    const columns = [
        
        columneHelper.accessor('id',{
            cell:(info) => info.getValue(),
            header:()=>(
                <span className="flex items-center">
                    <User size={16} />
                </span>
            )
        }),

        columneHelper.accessor('title',{
            cell:(info) => info.getValue(),
            header:()=>(
                <span className="flex items-center">
                    <BookOpenText size={16} />
                </span>
            )
        }),

        columneHelper.accessor('taskType',{
            cell:(info) => info.getValue(),
            header:()=>(
                <span className="flex items-center">
                    <BookOpenText size={16} />
                </span>
            )
        }),

        columneHelper.accessor('finalStatus',{
            cell:(info) => info.getValue(),
            header:()=>(
                <span className="flex items-center">
                    <BookOpenText size={16} />
                </span>
            )
        }),

        columneHelper.accessor('remarks',{
            cell:(info) => info.getValue(),
            header:()=>(
                <span className="flex items-center">
                    <BookOpenText size={16} />
                </span>
            )
        }),

        columneHelper.accessor('testerId',{
            cell:(info) => testerMap[info.getValue()],
            header:()=>(
                <span className="flex items-center">
                    <BookOpenText size={16} />
                </span>
            )
        }),

        columneHelper.accessor('startedAtUtc',{
            cell:(info) => formatDate(info.getValue()),
            header:()=>(
                <span className="flex items-center">
                    <BookOpenText size={16} />
                </span>
            )
        }),

        columneHelper.accessor('completedAtUtc',{
            cell:(info) => formatDate(info.getValue()),
            header:()=>(
                <span className="flex items-center">
                    <BookOpenText size={16} />
                </span>
            )
        })

     
    ]

    const [globalFilter,setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        state:{
            globalFilter
        },
        columns,
        onGlobalFilterChange:setGlobalFilter,
        getCoreRowModel:getCoreRowModel(),
        getFilteredRowModel:getFilteredRowModel()
    });

    return (
         <>
           <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

            <div className="mb-4 relative">
                <input 
                    value={globalFilter}
                    onChange={(e)=> setGlobalFilter(e.target.value) }
                    placeholder="Search...."
                    className="w-full pl-10 py-3 pr-4 border border-gray-300 rounded-md shadow-sm outline-none"
                />
                <Search 
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                        size={20}
                />
            </div>
            
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
       </>
    )
}

export default ReviewListPage;