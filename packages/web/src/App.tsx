import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/home";
import Task from "./pages/task";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/task/:id",
    element: <Task />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;