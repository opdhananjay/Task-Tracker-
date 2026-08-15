import { Eye, InfoIcon } from "lucide-react";
import { TEST_CASE_STATUS } from "../../Enums/appEnums";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import TestCaseTransaction from "./TestCaseTransaction";
import { formatDate, formatDateTime } from "../../utils/dateUtils";

const TestCases = ({ taskId, GetTestCasesByTaskId, TestCasesSaveUpdateService, error , getUserFromToken}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(null);

  const [mode, setMode] = useState("new");

  const [columnVisibility, setColumnVisibility] = useState({
    developerActualResult: false,
    testerActualResult: false,
  });
  
  const [testCases, setTestCases] = useState([]);


  const fetchTestCases = async () => {
      const response = await GetTestCasesByTaskId(taskId);
      if (response?.success && response?.data) {
        setTestCases(response.data);
      } else {
        console.error(response?.message || "Failed to fetch test cases");
      }
   };
    

  useEffect(() => {
    // setTestCases([
    //   {
    //     id: 1,
    //     testCaseTitle: "Test Case 1",
    //     expectedResult: "Expected Result 1",
    //     developerActualResult: "Dev Actual Result 1",
    //     testerActualResult: "Tester Actual Result 1",
    //     developerStatus: "PASSED",
    //     testerStatus: "FAILED",
    //     testerRemarks: "Tester Remarks 1",
    //   },
    // ]);

    fetchTestCases();

  },[])

  const columnHelper = createColumnHelper();

  const handleToggleForm = () => {
    if (showForm) {
      setSelectedTestCase(null);
      setMode("new");
      setShowForm(false);
      fetchTestCases();
    } else {
      setSelectedTestCase(null);
      setMode("new");
      setShowForm(true);
    }

    // setSelectedTestCase(null);
    // setMode("new");
    // setShowForm(true);
  };

  const handleView = (info, action) => {
    setSelectedTestCase(info.row.original);
    setMode(action === "view" ? "view" : "edit");
    setShowForm(true);
  };

  const columns = [
    columnHelper.display({
      id: "view",
      header: "act",
      cell: (info) => (
        <>
          <div className="flex gap-3">
            <button
              type="button"
              title="View"
              className="text-blue-600 hover-underline cursor-pointer"
              onClick={() => handleView(info, "edit")}
            >
              <Eye size={16} />
            </button>
          </div>
        </>
      ),
    }),

    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <InfoIcon className="mr-2" size={16} /> Id
        </span>
      ),
    }),

    columnHelper.accessor("testCaseTitle", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <InfoIcon className="mr-2" size={16} /> Test Case Name
        </span>
      ),
    }),

    columnHelper.accessor("developerStatus", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <InfoIcon className="mr-2" size={16} /> Dev Status
        </span>
      ),
    }),

    columnHelper.accessor("testerStatus", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <InfoIcon className="mr-2" size={16} /> Tester Status
        </span>
      ),
    }),

    columnHelper.accessor("testerRemarks", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <InfoIcon className="mr-2" size={16} /> Tester Remarks
        </span>
      ),
    }),

    columnHelper.accessor("developerActualResult", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <InfoIcon className="mr-2" size={16} /> Dev Actual Result
        </span>
      ),
    }),

    columnHelper.accessor("testerActualResult", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <InfoIcon className="mr-2" size={16} /> Tester Actual Results
        </span>
      ),
    }),

    columnHelper.accessor("createdAtUtc", {
      cell: (info) => formatDate(info.getValue()),
      header: () => (
        <span className="flex items-center">
          <InfoIcon className="mr-2" size={16} /> Created At
        </span>
      ),
    }),

      columnHelper.accessor("updatedAtUtc", {
      cell: (info) => formatDate(info.getValue()),
      header: () => (
        <span className="flex items-center">
          <InfoIcon className="mr-2" size={16} /> Updated At
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data: testCases, // Pass your test cases data here
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="">
      <div className="rounded-md flex items-center justify-end mb-2">
        <button
          className={`px-4 py-2 text-white rounded-md ${showForm ? "bg-gray-600" : "bg-orange-600"}`}
          onClick={handleToggleForm}
        >
          {showForm ? "All Test Cases" : "Add Test Case"}
        </button>
      </div>

      <div className="">
        {showForm && (
          <TestCaseTransaction taskId={taskId} testCase={selectedTestCase} mode={mode} TestCasesSaveUpdateService={TestCasesSaveUpdateService} getUserFromToken={getUserFromToken}  />
        )}
      </div>

      <div className="mt-4">
        {/* Render test cases here */}

        {!showForm && (
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
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={table.getVisibleLeafColumns().length}
                      className="px-6 py-4 text-sm text-gray-500 text-center"
                    >
                      No test cases found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCases;
