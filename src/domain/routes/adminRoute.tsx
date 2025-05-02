

import AdminLogin from "../../presentation/components/admin/AdminLogin";
import ErrorFallback from "../../presentation/components/common/ErrorFallback";
import Dashboard from "../../presentation/pages/admin/Dashboard";
import AdminAuthenticated from "../redux/protect/admin/adminAuthenticated";
import AdminPrivate from "../redux/protect/admin/adminPrivate";



const adminRoutes = [
    {
        path : '/admin/login',
        element :(<AdminAuthenticated><AdminLogin/></AdminAuthenticated>    ),
        errorElement: <ErrorFallback />,
    },
    {
        path: '/admin/users',
        element:(<AdminPrivate> <Dashboard/></AdminPrivate> ),
        errorElement: <ErrorFallback />,
    }
]


export default adminRoutes