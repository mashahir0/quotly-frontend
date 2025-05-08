import { createBrowserRouter, RouterProvider } from "react-router-dom";
import userRoutes from "./domain/routes/userRoute";
import adminRoutes from "./domain/routes/adminRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import ErrorFallback from "./presentation/components/common/ErrorFallback";
import ErrorBoundary from "./presentation/components/common/ErrorBoundary";



function App() {
  const routes = [...userRoutes,...adminRoutes  ]
  const router = createBrowserRouter(routes)
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID!;

  return (
   <>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <ErrorBoundary fallback={({ error, resetErrorBoundary }) => (
  <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
)}>
  <RouterProvider router={router} />
</ErrorBoundary>
    </GoogleOAuthProvider>
   <Toaster position="top-right" />
   </>
  );
}

export default App;
