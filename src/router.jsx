import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./app/components/layout/AppLayout";
import HomePage from "./app/components/pages/HomePage";
import BooksPage from "./app/components/pages/BooksPage";
import LoginPage from "./app/components/pages/LoginPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/books", element: <BooksPage /> },
      { path: "/login", element: <LoginPage /> },
    ],
  },
]);