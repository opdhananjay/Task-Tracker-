import { TEST_CASE_STATUS } from "../../Enums/appEnums";

const TestCaseTransaction = ({ testCase, mode = "new" }) => {
  const isViewMode = mode === "view";

  return (
    <>
     <form className="flex items-center space-x-4 shadow-md rounded-md p-4 bg-white">
        <div className="grid grid-cols-1 gap-4 w-full">
          <div className="flex flex-col items-start gap-2 space-x-2">
            <label className="text-sm font-semibold">Test Case Name</label>
            <input
              type="text"
              className="w-full border flex flex-1 border-gray-300 rounded-md px-2 p-2 text-sm"
              placeholder="Enter test case name"
              defaultValue={testCase?.testCaseTitle || ""}
              disabled={isViewMode}
            />
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label className="text-sm font-semibold">Expected Result</label>
            <textarea
              className="w-full h-32 resize-none p-2 border flex flex-1 border-gray-300 rounded-sm text-sm"
              placeholder="Add Expected Result here..."
              defaultValue={testCase?.expectedResult || ""}
              disabled={isViewMode}
            ></textarea>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label className="text-sm font-semibold">Dev Actual Result</label>
            <textarea
              className="w-full h-32 resize-none p-2 border flex flex-1 border-gray-300 rounded-sm text-sm"
              placeholder="Add Dev Actual Result here..."
              defaultValue={testCase?.developerActualResult || ""}
              disabled={isViewMode}
            ></textarea>
          </div>

          <div>
            <label className="text-sm font-semibold">Dev Status</label>
            <select className="w-full border flex flex-1 border-gray-300 rounded-md px-2 p-2 text-sm" defaultValue={testCase?.developerStatus || ""} disabled={isViewMode}>
              <option value="">Select Status</option>
              {Object.values(TEST_CASE_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label className="text-sm font-semibold">
              Tester Actual Result
            </label>
            <textarea
              className="w-full h-32 resize-none p-2 border flex flex-1 border-gray-300 rounded-sm text-sm"
              placeholder="Add Tester Actual Result here..."
              defaultValue={testCase?.testerActualResult || ""}
              disabled={isViewMode}
            ></textarea>
          </div>

          <div>
            <label className="text-sm font-semibold">Tester Status</label>
            <select className="w-full border flex flex-1 border-gray-300 rounded-md px-2 p-2 text-sm" defaultValue={testCase?.testerStatus || ""} disabled={isViewMode}>
              <option value="">Select Status</option>
              {Object.values(TEST_CASE_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label className="text-sm font-semibold">Tester Remarks </label>
            <textarea
              className="w-full h-32 resize-none p-2 border flex flex-1 border-gray-300 rounded-sm text-sm"
              placeholder="Add Tester Remarks here..."
              defaultValue={testCase?.testerRemarks || ""}
              disabled={isViewMode}
            ></textarea>
          </div>

          <div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md" disabled={isViewMode}>
              Save Test Case
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default TestCaseTransaction;
