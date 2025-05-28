import { createBrowserRouter } from "react-router";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GameListPage from "./pages/GameListPage";

import AdminAddGamePage from "./pages/AdminAddGamePage";
import AdminEditGamePage from "./pages/AdminEditGamePage";

import ProfilePage from "./pages/ProfilePage";
import AdminOrdersPage from "./pages/AdminOrdersPage";

import ProtectedRoute from "./context/protected";
import App from "./App";
import PrivacyPolicy from "./pages/PrivacyPolicyPage";
import AdminInstructions from "./pages/AdminInstructions";

const router = createBrowserRouter([
  {
    path: "/",

    element: <Layout />,
    children: [
      {
        path: "*",
        element: <App />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
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
        path: "/Games_List",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <GameListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/PrivacyPolicy",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <PrivacyPolicy />
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
    ],
  },
]);

export default router;
