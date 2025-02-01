import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Aboutus, Article, Blog, Contactus, Home, Login, Portofolio, Service, Admin } from "./ui/pages"
import { PortoDetail } from "./ui/organisms"
import { FirebaseProvider } from './utils/FirebaseContext';
import Career from './ui/pages/Career';
import AdminTemplate from './ui/templates/AdminTemplate';
import AdminPortofolio from './ui/pages/AdminPortofolio';
import AdminPortofolioEditor from './ui/pages/AdminPortofolioEditor';
import AdminArticleEditor from './ui/pages/AdminArticleEditor';
import AdminArticle from './ui/pages/AdminArticle';
import LandingTemplate from './ui/templates/LandingTemplate';
import AdminCareer from './ui/pages/AdminCareer';
import AdminCareerEditor from './ui/pages/AdminCareerEditor';
import AdminService from './ui/pages/AdminService';
import AdminServiceEditor from './ui/pages/AdminServiceEditor';
import AdminSubservice from './ui/pages/AdminSubservice';
import AdminSubserviceEditor from './ui/pages/AdminSubserviceEditor';
import AdminClientEditor from './ui/pages/AdminClientEditor';
import AdminClient from './ui/pages/AdminClient';

function App() {

  const routes = [
    // Landing Template Routes
    { path: "/", element: <Home />, type: "landing" },
    { path: "/service", element: <Service />, type: "landing" },
    { path: "/service/:serviceId", element: <Service />, type: "landing" },
    { path: "/portofolio", element: <Portofolio />, type: "landing" },
    { path: "/about", element: <Aboutus />, type: "landing" },
    { path: "/career", element: <Career />, type: "landing" },
    { path: "/blog", element: <Blog />, type: "landing" },
    { path: "/portofolio/:id", element: <PortoDetail />, type: "landing" },
    { path: "/review", element: <Contactus />, type: "landing" },
    { path: "/contact", element: <Contactus />, type: "landing" },
    { path: "/article/:id", element: <Article />, type: "landing" },

    // Login Route
    { path: "/login", element: <Login />, type: "basic" },

    // Admin Template Routes
    { path: "/admin/portofolio", element: <AdminPortofolio />, type: "admin" },
    { path: "/admin/add-portofolio", element: <AdminPortofolioEditor />, type: "admin" },
    { path: "/admin/edit-portofolio/:id", element: <AdminPortofolioEditor />, type: "admin" },
    { path: "/admin/add-article", element: <AdminArticleEditor />, type: "admin" },
    { path: "/admin/edit-article/:id", element: <AdminArticleEditor />, type: "admin" },
    { path: "/admin/article", element: <AdminArticle />, type: "admin" },
    { path: "/admin/add-career", element: <AdminCareerEditor />, type: "admin" },
    { path: "/admin/edit-career/:id", element: <AdminCareerEditor />, type: "admin" },
    { path: "/admin/career", element: <AdminCareer />, type: "admin" },
    { path: "/admin/service", element: <AdminService />, type: "admin" },
    { path: "/admin/add-service", element: <AdminServiceEditor />, type: "admin" },
    { path: "/admin/edit-service/:id", element: <AdminServiceEditor />, type: "admin" },
    { path: "/admin/service/:serviceId/subservice", element: <AdminSubservice />, type: "admin" },
    { path: "/admin/service/:serviceId/subservice/add", element: <AdminSubserviceEditor />, type: "admin" },
    { path: "/admin/service/:serviceId/subservice/:id", element: <AdminSubserviceEditor />, type: "admin" },
    { path: "/admin/client/add", element: <AdminClientEditor />, type: "admin" },
    { path: "/admin/client/:id", element: <AdminClientEditor />, type: "admin" },
    { path: "/admin/client", element: <AdminClient />, type: "admin" },
    { path: "/admin", element: <Admin />, type: "admin" },
  ];

  return (
    <FirebaseProvider>
      <BrowserRouter>
        <Routes>
          {routes.map(({ path, element, type }, index) => {
            if (type === "landing") {
              return (
                <Route
                  key={index}
                  path={path}
                  element={<LandingTemplate>{element}</LandingTemplate>}
                />
              );
            } else if (type === "admin") {
              return (
                <Route
                  key={index}
                  path={path}
                  element={<AdminTemplate>{element}</AdminTemplate>}
                />
              );
            } else {
              return (
                <Route
                  key={index}
                  path={path}
                  element={element}
                />
              );
            }
          })}
        </Routes>
      </BrowserRouter>
    </FirebaseProvider>
  );
}

export default App;
