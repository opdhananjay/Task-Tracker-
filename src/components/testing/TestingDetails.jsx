import { ArrowLeft, CalendarClock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../utils/dateUtils";

const TestingDetails = () => {
    
    const navigate = useNavigate();
    
    
    const handleBack = () => {
        navigate('/testing/testinglist')
    }

    return(
        <>
        <div className="w-full px-4 bg-gray-50">
            
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 p-4">
                
                <div onClick={handleBack} className="flex items-center gap-2 cursor-pointer text-blue-500 font-bold text-sm">
                    <ArrowLeft size={16} />
                    <span>Back to Testing List</span>
                </div>

                <div className="flex items-center gap-3">
                    
                    <button type="button" className="flex flex-1 items-center justify-center bg-gray-200 text-gray-700 text-sm rounded-sm px-3 py-2 gap-1 hover:bg-gray-300 transition-colors">
                        Add Comments 
                    </button>

                </div>
                 
            </div>

            <div className="flex flex-col justify-center gap-2 p-4 bg-white rounded-sm shadow-sm">

                <div className="">
                    <span className="text-sm font-boldf flex items-center gap-1 bg-blue-100 text-blue-600 rounded-sm px-2 py-1 w-fit">
                        Task - 0002
                    </span>
                </div>

                <div className="flex justify-between items-center gap-2" >

                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Testing - {"Task Title"}</span>
                    </div>

                    <div className="flex items-center gap-2">

                        <button type="button" className="flex items-center gap-1 bg-white-600 text-sm rounded-sm px-3 py-2 border border-gray-300 hover:bg-gray-100">
                            <Play size={16}/> Start Testing 
                        </button>

                    </div>

                </div>

                <div className="flex justify-start items-center gap-2">

                    <div className="">
                        <span className="text-sm text-gray-500 bg-gray-100 text-red-600 rounded-sm px-2 py-1 w-fit">
                            {"Task Priority"}
                        </span>
                    </div>

                    <div className="">
                        <span className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 text-gray-600 rounded-sm px-2 py-1 w-fit font-semibold"> <CalendarClock size={16} />  Due : {'-'}</span>
                    </div>


                    <div className={``}>
                        <span className={`flex items-center gap-2 text-sm text-gray-500 text-gray-600 rounded-sm px-2 py-1 w-fit font-semibold`}> Status : {"status"} </span>
                    </div>

                </div>

            </div>
                
        </div>
        </>
    )
    
}

export default TestingDetails;