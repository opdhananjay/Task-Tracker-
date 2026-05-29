import { useParams } from "react-router-dom";
import CreateTask from "../../components/Tasks/CreateTask";

const CreateTaskPage = () => {

    const { taskId, action } = useParams();
    console.log("Route Params:", { taskId, action });   
    return (
        <CreateTask taskId={taskId} action={action} />
    )
}

export default CreateTaskPage;