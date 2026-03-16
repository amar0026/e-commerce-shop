 import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./authcontext";

/**
 * Wrap any route that requires auth.
 * If not logged in → redirect to /login and remember the intended URL.
 * After login the user is sent back to exactly where they were trying to go.
 *
 * Usage in App.tsx / router:
 *
 *   <Route path="/product/:id" element={
 *     <ProtectedRoute>
 *       <ProductDetails />
 *     </ProtectedRoute>
 *   } />
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const location       = useLocation();

  if (!isLoggedIn) {
    // Save the page the user was trying to visit
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}