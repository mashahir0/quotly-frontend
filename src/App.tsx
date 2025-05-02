import { createBrowserRouter, RouterProvider } from "react-router-dom";
import userRoutes from "./domain/routes/userRoute";
import adminRoutes from "./domain/routes/adminRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";



function App() {
  const routes = [...userRoutes,...adminRoutes  ]
  const router = createBrowserRouter(routes)
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID!;

  return (
   <>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <RouterProvider router={router}/>
    </GoogleOAuthProvider>
   <Toaster position="top-right" />
   </>
  );
}

export default App;
