import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import SimpleLayout from "./layouts/simple";
//
import BlogPage from "./pages/BlogPage";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import Page404 from "./pages/Page404";
import ProductsPage from "./pages/ProductsPage";
import DashboardAppPage from "./pages/DashboardAppPage";
import TodosPage from "./pages/TodosPage";
import PrivateRoute from "./layouts/PrivateRoute";
import AddProduct from "./pages/AddProduct";
import ProductDetailsPage from "./pages/ProductDetailspage";
import FilesPage from "./pages/FilesPage";

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        {
          path: "app",
          element: (
            <PrivateRoute>
              <DashboardAppPage />
            </PrivateRoute>
          ),
        },
        {
          path: "user",
          element: (
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          ),
        },
        {
          path: "files",
          element: (
            <PrivateRoute>
              <FilesPage />
            </PrivateRoute>
          ),
        },
        {
          path: "products",
          element: (
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
          ),
        },
        {
          path: "product/:id",
          element: (
            <PrivateRoute>
              <ProductDetailsPage />
            </PrivateRoute>
          ),
        },
        { path: "blog", element: <BlogPage /> },
        {
          path: "todos",
          element: (
            <PrivateRoute>
              <TodosPage />
            </PrivateRoute>
          ),
        },
        {
          path: "addproduct",
          element: (
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
