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
import ProfileTemplate from "./ui/templates/ProfileTemplate";
import Profile from "./ui/pages/Profile";
import ProfileReport from "./ui/pages/ProfileReport";
import ProfileReportEditor from "./ui/pages/ProfileReportEditor";
import PDFCanvas from "./ui/pages/PDFCanvas";
import ReportViewer from "./ui/pages/ReportViewer";
import ViewerTemplate from "./ui/templates/ViewerTemplate";
import ProfileVisit from "./ui/pages/ProfileVisit";
import ProfileVisitEditor from "./ui/pages/ProfileVisitEditor";
import VisitViewer from "./ui/pages/VisitViewer";

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

    // Profile
    { path: "/profile", element: <Profile />, type: "profile" },
    { path: "/report", element: <ProfileReport />, type: "profile" },
    { path: "/visit", element: <ProfileVisit />, type: "profile" },
    { path: "/assistant", element: <ProfileReport />, type: "profile" },
    { path: "/schedule", element: <ProfileReport />, type: "profile" },
    { path: "/warranty", element: <ProfileReport />, type: "profile" },
    { path: "/canvas/:id", element: <PDFCanvas />, type: "profile" },

    // Form
    { path: "/report/editor", element: <ProfileReportEditor />, type: "profile" },
    { path: "/report/view/:id", element: <ReportViewer />, type: "viewer" },
    { path: "/report/editor/:id", element: <ProfileReportEditor />, type: "profile" },

    { path: "/visit/editor", element: <ProfileVisitEditor />, type: "profile" },
    { path: "/visit/view/:id", element: <VisitViewer />, type: "viewer" },
    { path: "/visit/editor/:id", element: <ProfileVisitEditor />, type: "profile" },


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
            } else if (type === "profile") {
              return (
                <Route
                  key={index}
                  path={path}
                  element={<ProfileTemplate>{element}</ProfileTemplate>}
                />
              );
            } else if (type === "viewer") {
              return (
                <Route
                  key={index}
                  path={path}
                  element={<ViewerTemplate>{element}</ViewerTemplate>}
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
