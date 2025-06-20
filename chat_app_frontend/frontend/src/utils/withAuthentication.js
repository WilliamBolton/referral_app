import { useEffect } from "react"
import { Navigate } from "react-router-dom";
import ChatArea from "../Components/ChatArea";


const withAuthentication = (wrappedComponent) => {
    // Ensures a user is authenticated 
    return function AuthComponent(props){
        contst [isAuthenticated, setIsAuthenticated] = useState(false)

        useEffect(() => {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))
            if(token){
                setisAuthenticated(true)
            }else{
                setisAuthenticated(False)
            }
        }, []);
        if (isAuthenticated){
            return <wrappedComponent {...props}/>
        }else{
            return <Navigate to="/login"/>
        }
    };
};

export default withAuthentication(ChatArea)
