import CreateUser from "../../components/Users/CreateUser";

const RegistrationPage = () => {
    return (
        <CreateUser viaOrganization={false} organizationId={null} action={"create"} userId={null} />
    )  
}

export default RegistrationPage;