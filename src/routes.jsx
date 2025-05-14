import Layout from "./components/layout/Layout";
import Publications from "./pages/Publications";
import Comments from "./pages/Comments";
import Courses from "./pages/Courses";

const routes = [
    {
        path: "/",
        element: <Layout />,
        Children: [
            {path: "publications", element: <Publications />},
            {path: "comments", element: <Comments />},
            {path: "courses", element: <Courses />},
            {index: true, element: <Publications />},
        ],
    },
];

export default routes;
