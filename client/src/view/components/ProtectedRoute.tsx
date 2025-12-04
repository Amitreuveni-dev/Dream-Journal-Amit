import { useContext, type PropsWithChildren } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";


const ProtectedRoute = ({ children }: PropsWithChildren) => {

    const { user, loading } = useContext(AuthContext)

    if (loading) {
        return<div>Loading...</div>
    }
    if(!user) {
        return <Navigate to="/login" replace />
    }
    return children;
  
}

export default ProtectedRoute
