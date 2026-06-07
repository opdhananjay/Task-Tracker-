import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { CircleX, Eye, User } from "lucide-react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useMaster from "../../hooks/useMaster";
import useDeveloper from "../../hooks/useDeveloper";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyDevTasks = () => {

  const { getUserFromToken }  = useAuth();

  const { GetOrgDevTasksLst} = useDeveloper() 

    // Get lookup maps from useMaster
  const { fetchDevelopersAndTestersAndOrg, developerMap, testerMap , organizationMap } = useMaster();

  useEffect(() => {
    
    const fectchData = async () => {
        const user = getUserFromToken();
        const orgId = user.organizationId;

        if(!orgId){
            toast.error("No organization found for user");
            return;
        }

        if(!user.userId){
            toast.error("No user found");
            return;
        }

        // Fetch developers & testers first (to build lookup maps)
        await fetchDevelopersAndTestersAndOrg(orgId);
        
        const payload = {
            organizationId: orgId,
            userId: user.userId
        };

        const response = await GetOrgDevTasksLst(payload);
        
        console.log('tasks', response);
        
        if(response?.success && response?.data) {
            setData(response.data);
        }
        else{
            setData([]);
            toast.error(response?.message);
        }
    }

    fectchData();

  },[]) 

  const navigate = useNavigate();

  const handleView = (info, action) => {
    const taskId = info.row.original.id;
        const organizationId = info.row.original.organizationId;

    if(action === "view"){
        navigate(`/development/taskdetails/${organizationId}/${taskId}/view`);
    }
  }

  const [data, setData] = useState([]);

  const columnHelper = createColumnHelper();

  const columns = [

       columnHelper.display({
            id:"view",
            header:"act",
            cell:(info) => (
                <>
                    <div className="flex gap-3">

                        <button type="button" className="text-blue-600 hover-underline cursor-pointer" onClick={()=> handleView(info,'view') } >
                           <Eye size={16} /> 
                        </button>

                    </div>
                </>
            )
       }),

        columnHelper.accessor('id',{
            cell:(info) => info.getValue(),
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> ID
                </span>
            )
        }),

        columnHelper.accessor('title',{
            cell:(info) => info.getValue(),
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Title
                </span>
            )
        }),

        columnHelper.accessor('taskType',{
            cell:(info) => info.getValue(),
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Type
                </span>
            )
        }),

        columnHelper.accessor('developerId',{
            cell:(info) => developerMap[info.getValue()] || '-',
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Developer
                </span>
            )
        }),

        columnHelper.accessor('testerId',{
            cell:(info) => testerMap[info.getValue()] || '-',
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Tester
                </span>
            )
        }),

        columnHelper.accessor('createdBy',{
            cell:(info) => info.getValue(),
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Created By
                </span>
            )
        }),

        columnHelper.accessor('startDateTime',{
            cell:(info) => info.getValue(),
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Start Date Time
                </span>
            )
        }),

        columnHelper.accessor('dueDateTime',{
            cell:(info) => info.getValue(),
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Due Date Time
                </span>
            )
        }),

        columnHelper.accessor('priority',{
            cell:(info) => info.getValue(),
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Priority
                </span>
            )
        }),


         columnHelper.accessor('status',{
            cell:(info) => info.getValue(),
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Status
                </span>
            )
        }),


        columnHelper.accessor('unitTestingStatus',{
            cell:(info) => info.getValue(),
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Unit Testing Status
                </span>
            )
        }),


        columnHelper.accessor('createdAt',{
            cell:(info) => info.getValue(),
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Created At
                </span>
            )
        }),

        columnHelper.accessor('updatedAt',{
            cell:(info) => info.getValue(),
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Updated At
                </span>
            )
        }),

        columnHelper.accessor('organizationId',{
            cell:(info) => organizationMap[info.getValue()] || '-',
            header:() => (
                <span className="flex items-center">
                    <User className='mr-2' size={16}/> Org
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
          getFilteredRowModel:getFilteredRowModel(),
   });

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      <div>

      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyDevTasks;
