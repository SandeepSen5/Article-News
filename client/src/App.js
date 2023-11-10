import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet
} from "react-router-dom";

import axios from "axios";
import Topbar from "./component/topbar/topbar";
import Home from "./pages/home/home";
import Single from "./pages/single/single";
import Write from "./pages/write/write";
import Settings from "./pages/settings/settings";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Mypage from "./pages/Mypage/Mypage";
import ResponsiveAppBar from "./component/topbar/bar";
import Error from "./pages/error/error";
import Categorypost from "./pages/categorypost/categorypost";
axios.defaults.baseURL = 'http://localhost:4040';
axios.defaults.withCredentials = true;

const Layout = () => {
  return (
    <>
      {/* <Topbar /> */}
      <ResponsiveAppBar />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/mypost",
        element: <Mypage />,
      },
      {
        path: "/post/:id",
        element: <Single />,
      },
      {
        path: "/write",
        element: <Write />,
      },
      {
        path: "/write/:id",
        element: <Write />,
      },
      {
        path: "/profile",
        element: <Settings />,
      },
      {
        path: "/category",
        element: <Categorypost />,
      },
      {
        path: "*",
        element: <Error />,
      },
    ]
  },
]);


function App() {
  return (
    <>
      <div className='app'>
        <div className='container'>
          <RouterProvider router={router} />
        </div>
      </div>
    </>
  );
}

export default App;
