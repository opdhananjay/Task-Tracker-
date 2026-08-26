import { useForm } from "react-hook-form";
import { TEST_CASE_STATUS } from "../../Enums/appEnums";

const TestCaseTransaction = ({ taskId, testCase, mode = "new", TestCasesSaveUpdateService, getUserFromToken , onSuccess }) => {
  
  const isViewMode = mode === "view";

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    const user = +getUserFromToken()?.userId
    
    const payload = {
      ...data,
      createdBy: user,
      id: testCase?.id || null,
      taskId: +taskId,
      updatedBy:user
    }

    //console.log("Payload for saving test case:", payload);
    
    if (TestCasesSaveUpdateService) {
      const response = await TestCasesSaveUpdateService(payload);
      if (response?.success) {
        console.log("Test case saved successfully");
      } else {
        console.error(response?.message || "Failed to save test case");
      }
      if(onSuccess){
        onSuccess();
      }
    }
  };

  return (
    <>
     <form className="flex items-center space-x-4 shadow-md rounded-md p-4 bg-white">
        <div className="grid grid-cols-1 gap-4 w-full">
          <div className="flex flex-col items-start gap-2 space-x-2">
            <label className="text-sm font-semibold">Test Case Name</label>
            <input
              {...register("testCaseTitle",{
                  required: "Test Case Name is required",
              })}
              name="testCaseTitle"
              type="text"
              className="w-full border flex flex-1 border-gray-300 rounded-md px-2 p-2 text-sm"
              placeholder="Enter test case name"
              defaultValue={testCase?.testCaseTitle || ""}
              disabled={isViewMode}
            />
            {errors.testCaseTitle && (
              <span className="text-red-500 text-sm">
                {errors.testCaseTitle.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label className="text-sm font-semibold">Expected Result</label>
            <textarea
              {...register("expectedResult",{
                  required: "Expected Result is required",
              })}
              name="expectedResult"
              className="w-full h-32 resize-none p-2 border flex flex-1 border-gray-300 rounded-sm text-sm"
              placeholder="Add Expected Result here..."
              defaultValue={testCase?.expectedResult || ""}
              disabled={isViewMode}
            ></textarea>
            {errors.expectedResult && (
              <span className="text-red-500 text-sm">
                {errors.expectedResult.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label className="text-sm font-semibold">Dev Actual Result</label>
            <textarea
              {...register("developerActualResult",{
                  required: "Developer Actual Result is required",
              })}
              name="developerActualResult"
              className="w-full h-32 resize-none p-2 border flex flex-1 border-gray-300 rounded-sm text-sm"
              placeholder="Add Dev Actual Result here..."
              defaultValue={testCase?.developerActualResult || ""}
              disabled={isViewMode}
            ></textarea>
            {errors.developerActualResult && (
              <span className="text-red-500 text-sm">
                {errors.developerActualResult.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">Dev Status</label>
            <select className="w-full border flex flex-1 border-gray-300 rounded-md px-2 p-2 text-sm" defaultValue={testCase?.developerStatus || ""} disabled={isViewMode} 
              {...register("developerStatus",{
                  required: "Developer Status is required",
              })}
            >
              <option value="">Select Status</option>
              {Object.values(TEST_CASE_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.developerStatus && (
              <span className="text-red-500 text-sm">
                {errors.developerStatus.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label className="text-sm font-semibold">
              Tester Actual Result
            </label>
            <textarea
              {...register("testerActualResult",{
                  required: "Tester Actual Result is required",
              })}
              name="testerActualResult"
              className="w-full h-32 resize-none p-2 border flex flex-1 border-gray-300 rounded-sm text-sm"
              placeholder="Add Tester Actual Result here..."
              defaultValue={testCase?.testerActualResult || ""}
              disabled={isViewMode}
            ></textarea>
          </div>

          <div>
            <label className="text-sm font-semibold">Tester Status</label>
            <select className="w-full border flex flex-1 border-gray-300 rounded-md px-2 p-2 text-sm" defaultValue={testCase?.testerStatus || ""} disabled={isViewMode}
              {...register("testerStatus",{
                  required: "Tester Status is required",
              })}
            >
              <option value="">Select Status</option>
              {Object.values(TEST_CASE_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.testerStatus && (
              <span className="text-red-500 text-sm">
                {errors.testerStatus.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label className="text-sm font-semibold">Tester Remarks </label>
            <textarea 
              {...register("testerRemarks",{
                  required: "Tester Remarks is required",
              })}
              name="testerRemarks"
              className="w-full h-32 resize-none p-2 border flex flex-1 border-gray-300 rounded-sm text-sm"
              placeholder="Add Tester Remarks here..."
              defaultValue={testCase?.testerRemarks || ""}
              disabled={isViewMode}
            ></textarea>
          </div>

          <div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md" onClick={handleSubmit(onSubmit)}  disabled={isViewMode}>
              Save Test Case
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default TestCaseTransaction;
