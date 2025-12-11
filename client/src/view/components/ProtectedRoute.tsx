import { Navigate } from "react-router";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute
