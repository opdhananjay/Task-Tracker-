import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { BookOpenText, Bug, ChartColumnBig, Equal, Eye, Info, Search, Timer, TimerOff, User } from "lucide-react";
import useMaster from "../../hooks/useMaster";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useTask from "../../hooks/useTask";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../utils/dateUtils";

const TestingList = () => {

    const navigate = useNavigate();

    const [data,setData] = useState([]);

    const { getUserFromToken } = useAuth();

    const { getTasks } = useTask();

    const { fetchDevelopersAndTestersAndOrg, developerMap, testerMap , organizationMap } = useMaster();

    const columneHelper = createColumnHelper();

    useEffect(()=>{

        const fetchData = async () => {
            const user = getUserFromToken();
            const orgId = user.organizationId;
            // Fetch Master Lookup
            await fetchDevelopersAndTestersAndOrg(orgId);
            // Then Fetch tasks using orgid
            const response = await getTasks(Number(orgId));
            if(response?.success && response?.data){
                setData(response.data);
            }
        }

        fetchData();

    },[]);


    const handleView = (info,mode) => {
        const taskId = info.row.original.id;
        const organizationId = info.row.original.organizationId;
        navigate(`/testing/testingDetails/${organizationId}/${taskId}/view`)
    }   

    
    const columns = [

   columneHelper.display({
            id:"view",
            header:"act",
            cell:(info) => (
                <>
                <div className="flex gap-3">
                    <button type="button" title="View"
                        className="text-blue-600 hover-underline cursor-pointer"
                        onClick={() => handleView(info,"view") }
                    >
                        <Eye size={16} />
                    </button>
                    
                </div>
                </>
            ),
        }),

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

        columneHelper.accessor('developerId',{
            cell:(info) => developerMap[info.getValue()] || "-",
            header:()=>(
                <span className="flex items-center">
                    <Equal className="mr-2" size={16} /> Developer
                </span>
            )
        }),

        columneHelper.accessor('testerId',{
            cell:(info) => testerMap[info.getValue()] || "-",
            header:() => (
                <span className="flex items-center">
                    <Equal className="mr-2" size={16} /> Tester
                </span>
            )
        }),

        columneHelper.accessor('startDateTime',{
            cell:(info) => formatDateTime(info.getValue()),
            header: () => (
                <span className="flex items-center">
                    <Timer className="mr-2" size={16} /> Start DateTime 
                </span>
            )
        }),

        columneHelper.accessor('dueDateTime',{
            cell:(info) => formatDateTime(info.getValue()),
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

        columneHelper.accessor('unitTestingStatus',{
            cell:(info)=> info.getValue() || "-",
            header:() => (
                <span className="flex items-center">
                    <Bug className="mr-2" size={16} /> Unit Testing 
                </span>
            )
        }),

        columneHelper.accessor('createdAt',{
            cell:(info) => formatDateTime(info.getValue()),
            header: () => (
                <span className="flex items-center">
                    <Timer className="mr-2" size={16} /> Created At 
                </span>
            )
        }),
        
        columneHelper.accessor('updatedAt',{
            cell:(info) => formatDateTime(info.getValue()),
            header: () => (
                <span className="flex items-center">
                    <Timer className="mr-2" size={16} /> Updated At 
                </span>
            )
        }),

        columneHelper.accessor('organizationId',{
            cell:(info) => organizationMap[info.getValue()] || "-",
            header:()=>(
                <span className="flex items-center">
                    <Equal className="mr-2" size={16} /> Organization
                </span>
            )
        }),

    ];

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
    })

    return(
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

export default TestingList;

