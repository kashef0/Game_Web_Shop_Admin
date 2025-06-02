import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./context/protected";
import App from "./App";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import AdminAddGamePage from "./pages/AdminAddGamePage";
import GameListPage from "./pages/GameListPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import AdminInstructions from "./pages/AdminInstructions";
import AdminEditGamePage from "./pages/AdminEditGamePage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminInbox from "./pages/AdminInbox";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <GameListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      
      {
        path: "/admin/Add_games",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAddGamePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/PrivacyPolicy",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <PrivacyPolicyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/AdminInstructions",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminInstructions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/games/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminEditGamePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/AdminOrdersPage",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/AdminInbox",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminInbox />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <App />,
      },
    ],
  },
]);

export default router;
