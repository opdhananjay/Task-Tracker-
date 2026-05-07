const useUsers = () => {
    
    const context = useContext(LoaderContext);
    
    if(!context){
        throw new Error('Loader Context Error');
    }
        
    const { setLoading } = context;

    const [error,setError] = useState(null);

    const createUser = async () => {

    }

    const getUsers = async () => {
        
    }

    return {createUser,getUsers};
}

export default useUsers;

// use this hook in form - 1. create user component , 2 get users component
// refer useTask.jsx Hook code  

