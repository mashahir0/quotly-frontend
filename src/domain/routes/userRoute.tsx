import { Navigate } from "react-router-dom";
import LoginForm from "../../presentation/components/user/Login";
import RegisterForm from "../../presentation/components/user/Register";
import HomePage from "../../presentation/pages/user/HomePage";
import UserAuthenticated from "../redux/protect/user/UserAuthenticated";
import UserPrivate from "../redux/protect/user/userPrivate";
import MyPostPage from "../../presentation/pages/user/MyPostPage";
import TopProfilesPage from "../../presentation/pages/user/TopProfilesPage";
import ChatPage from "../../presentation/pages/user/ChatPage";
import SharedPageView from "../../presentation/pages/user/SharedPageView";
import ForgotPassword from "../../presentation/components/user/ForgotPass";
import ErrorFallback from "../../presentation/components/common/ErrorFallback";


const userRoutes = [
  {
    path: "/",
    element: <Navigate to="/login" />,
    errorElement: <ErrorFallback />,
  },
  {
    path: "/login",
    element:(
      <UserAuthenticated><LoginForm /></UserAuthenticated>
      ),
      errorElement: <ErrorFallback />,
  },
  {
    path: "/register",
    element: (<UserAuthenticated><RegisterForm /></UserAuthenticated>),
    errorElement: <ErrorFallback />,
  },
  {
    path:'/home',
    element:(<UserPrivate><HomePage/></UserPrivate>),
    errorElement: <ErrorFallback />,
  },
  {
    path:'/my-posts',
    element:(<UserPrivate><MyPostPage/></UserPrivate>),
    errorElement: <ErrorFallback />,
  },
  {
    path:'/top-profiles',
    element:(<UserPrivate><TopProfilesPage/></UserPrivate>),
    errorElement: <ErrorFallback />,
  },
  {
    path:'/message',
    element:(<UserPrivate><ChatPage/></UserPrivate>),
    errorElement: <ErrorFallback />,
  },
  {
    path:'/sharedQuote/:shareId',
    element:(<SharedPageView/>),
    errorElement: <ErrorFallback />,
  },
  {
    path:'/reset-password',
    element:(<ForgotPassword/>),
    errorElement: <ErrorFallback />,
  },
];

export default userRoutes;
