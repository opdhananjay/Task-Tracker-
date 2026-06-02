import { useParams } from "react-router-dom";
import CreateUser from "../../components/Users/CreateUser"
import useAuth from "../../hooks/useAuth";

const CreateUserPage = () => {

    const { getUserFromToken } = useAuth();

    const { action, userId } = useParams(); // 'edit' or 'create'
    
    return (
        <>
        <CreateUser viaOrganization={true} organizationId={getUserFromToken()?.organizationId} action={action}  userId={userId} />
        </>
    )
}

export default CreateUserPage;