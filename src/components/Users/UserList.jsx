import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { Edit, Eye, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import useUsers from "../../hooks/useUsers";
import useAuth from "../../hooks/useAuth";
import useMaster from "../../hooks/useMaster";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserList = () => {

    const navigate = useNavigate();

    const handleRedirect = (info,action) => {
        navigate(`/users/create/${info.row.original.id}/${action}`)
    }

    const columnHelper = createColumnHelper();

    const columns = [

        columnHelper.display({
            id:"view",
            header:"act",
            cell:(info) => (
                <>
                  <div className="flex gap-3">
                        <button type="button" title="View"
                            className="text-blue-600 hover-underline cursor-pointer"
                            onClick={() => handleRedirect(info,"view") }
                        >
                            <Eye size={16} />
                        </button>

                         <button type="button" title="View"
                            className="text-blue-600 hover-underline cursor-pointer"
                            onClick={() => handleRedirect(info,"edit") }
                        >
                            <Edit size={16} />
                        </button>
                  </div>

                </>
            )
        }),

        
        columnHelper.accessor('id',{
            cell:(info) => info.getValue(),
            header:() => {
                return <span className="flex items-center">
                    <User className='mr-2' size={16}/> ID
                </span>
            }
        }),

        columnHelper.accessor('firstName',{
            cell:(info) => info.getValue(),
            header:() => {
                return <span className="flex items-center">
                    <User className='mr-2' size={16}/> First Name
                </span>
            }
        }),

        columnHelper.accessor('lastName',{
            cell:(info) => info.getValue(),
            header:() => {
                return <span className="flex items-center">
                    <User className='mr-2' size={16}/> Last Name
                </span>
            }
        }),

        columnHelper.accessor('email',{
            cell:(info) => info.getValue(),
            header:() => {
                return <span className="flex items-center">
                    <User className='mr-2' size={16}/> Email
                </span>
            }
        }),

        columnHelper.accessor('role',{
            cell:(info) => info.getValue(),
            header:() => {
                return <span className="flex items-center">
                    <User className='mr-2' size={16}/> Role
                </span>
            }
        }),

        columnHelper.accessor('organizationId',{
            cell:(info) => organizationMap[info.getValue()] || "-",
            header:() => {
                return <span className="flex items-center">
                    <User className='mr-2' size={16}/> Organization
                </span>
            }
        }),

        columnHelper.accessor('isActive',{
            cell:(info) => info.getValue() ? "Active" : "Inactive",
            header:() => {
                return <span className="flex items-center">
                    <User className='mr-2' size={16}/> Status
                </span>
            }
        }),

        columnHelper.accessor('createdAt',{
            cell:(info) => info.getValue(),
            header:() => {
                return <span className="flex items-center">
                    <User className='mr-2' size={16}/> Created At
                </span>
            }
        }),

        columnHelper.accessor('updatedAt',{
            cell:(info) => info.getValue(),
            header:() => {
                return <span className="flex items-center">
                    <User className='mr-2' size={16}/> Updated At
                </span>
            }
        })
    ]

    const { getUserFromToken } = useAuth();

    const {getUsersListByOrgId} = useUsers();
     // Get lookup maps from useMaster
    const { fetchDevelopersAndTestersAndOrg, organizationMap } = useMaster();

    const [data, setData] = useState([]);

    const [globalFilter,setGlobalFilter] = useState("");

    useEffect(() => {

        const fetchData = async () => {

            const user = getUserFromToken();

            const orgId = user?.organizationId;

            if(!orgId){
                toast.error("No organization found for user");
                return;
            }

            console.log("Fetching users for orgId:", orgId);

            await fetchDevelopersAndTestersAndOrg(orgId); // Fetch org data for lookup map
            const response = await getUsersListByOrgId(orgId);

            if(response?.success && response?.data){
                setData(response.data);
            }
        };


        fetchData();
    },[]);

    const table = useReactTable({
        data,
        columns,
        onGlobalFilterChange:setGlobalFilter,
        getCoreRowModel:getCoreRowModel(),
        getFilteredRowModel:getFilteredRowModel(),
    });

    return (
        <>
            <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                <div className="mb-4 relative">

                    <input
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full pl-10 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search..."
                    />
                    <Search 
                        className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                            size={20}
                    />

                </div>


                <div className="overflow-x-auto bg-white shadow-md rounded-lg">

                    <table className="min-w-full divide-y divide-gray-200">

                        <thead>

                            {
                               table.getHeaderGroups().map((headerGroup) => (

                                    <tr key={headerGroup.id}>
                                        {
                                            headerGroup.headers.map((header)=>(
                                                
                                                <th key={header.id} 
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
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                        {
                                            row.getVisibleCells().map((cell) => (
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

export default UserList;