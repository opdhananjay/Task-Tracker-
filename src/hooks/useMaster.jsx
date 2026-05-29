
import { LoaderContext } from "../context/LoaderProvider";
import { useContext, useState } from "react";
import { GetOrganizationService, GetUserByRoleService } from "../services/masterService";

const useMaster = () => {

    const { setLoading } = useContext(LoaderContext);

    const [error, setError] = useState(null);

    // State to store developers and testers lists
    const [developers, setDevelopers] = useState([]);
    const [testers, setTesters] = useState([]);
    const [organization, setOrganization] = useState([]);

    // Lookup maps for quick ID → Name conversion
    const [developerMap, setDeveloperMap] = useState({});
    const [testerMap, setTesterMap] = useState({});
    const [organizationMap, setOrganizationMap] = useState({});

    const GetUserByRole = async (payload) => {
        setLoading(true)
        try {
            const response = await GetUserByRoleService(payload);
            return response.data;
        }
        catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to fetch users");
            return null;
        }
        finally {
            setLoading(false);
        }
    }

    // Fetch both developers and testers + create lookup maps
    const fetchDevelopersAndTestersAndOrg = async (organizationId) => {
        setLoading(true);
        try {
            // Fetch developers
            const devPayload = { role: "Developer", organizationId: Number(organizationId) };
            const devResponse = await GetUserByRoleService(devPayload);

            if (devResponse.data?.success && devResponse.data?.data) {
                const devList = devResponse.data.data;
                setDevelopers(devList);

                // Create developer lookup map: { "5": "Dhananjay" }
                const devMap = {};
                devList.forEach(dev => {
                    devMap[dev.id] = dev.name;
                });
                setDeveloperMap(devMap);
            }

            // Fetch testers
            const testerPayload = { role: "Tester", organizationId: Number(organizationId) };
            const testerResponse = await GetUserByRoleService(testerPayload);

            if (testerResponse.data?.success && testerResponse.data?.data) {
                const testerList = testerResponse.data.data;
                setTesters(testerList);

                // Create tester lookup map: { "4": "Rahul" }
                const testMap = {};
                testerList.forEach(tester => {
                    testMap[tester.id] = tester.name;
                });
                setTesterMap(testMap);
            }

            const organizationResponse = await GetOrganizationService(Number(organizationId));
            if (organizationResponse.data?.success && organizationResponse.data?.data) {
                setOrganization(organizationResponse.data.data);
                // Create organization lookup map: { "1": "Org organizationName" }
                const orgMap = {};
                organizationResponse.data.data.forEach(org => {
                    orgMap[org.id] = org.organizationName;
                });
                setOrganizationMap(orgMap);
            }


        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    return { 
        GetUserByRole, 
        fetchDevelopersAndTestersAndOrg,
        developers,
        testers,
        organization,
        developerMap,
        testerMap,
        organizationMap,
        error 
    };
}

export default useMaster;