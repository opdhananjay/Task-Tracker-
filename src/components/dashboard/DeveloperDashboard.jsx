import useAuth from "../../hooks/useAuth";

const DeveloperDashboard = () => {

    const {  } = useAuth();

    return (
        <>
            <div className="w-full px-8 py-4">

                <div className="flex justify-between mb-2 px-8 border-b border-gray-300">
                    
                    <div className="mb-4">
                        <h2 className="text-2xl text-gray-500 font-bold">Hello, <span className="text-gray-800 font-bold">{"Dhananjay"}</span> </h2>
                    </div>
                    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                    
                    <div className="border rounded-lg p-6 bg-white">
                        <h3 className="text-sm text-gray-500">
                            MY TASKS
                        </h3>

                        <p className="text-4xl font-bold">
                            5
                        </p>
                    </div>

                    <div className="border rounded-lg p-6 bg-white">
                        <h3 className="text-sm text-gray-500">
                            IN PROGRESS
                        </h3>

                        <p className="text-4xl font-bold">
                            3
                        </p>
                    </div>

                    <div className="border rounded-lg p-6 bg-white">
                        <h3 className="text-sm text-gray-500">
                            DONE
                        </h3>

                        <p className="text-4xl font-bold">
                            10
                        </p>
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 mt-6">
                    
                    <div className="border rounded-lg p-6 bg-white">
                        Recent Activities
                    </div>

                    <div className="border rounded-lg p-6 bg-white">
                        Upcoming Deadlines
                    </div>

                </div>



            </div>
        </>
    )
}

export default DeveloperDashboard;