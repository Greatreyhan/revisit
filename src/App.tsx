import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Blog, Home, Login, Admin, Article } from "./ui/pages"
import { FirebaseProvider } from './utils/FirebaseContext';
import AdminTemplate from './ui/templates/AdminTemplate';

import AdminArticleEditor from './ui/pages/AdminArticleEditor';
import AdminArticle from './ui/pages/AdminArticle';
import LandingTemplate from './ui/templates/LandingTemplate';

import ProfileTemplate from "./ui/templates/ProfileTemplate";
import Profile from "./ui/pages/Profile";
import ProfileReport from "./ui/pages/ProfileReport";
import ProfileReportEditor from "./ui/pages/ProfileReportEditor";
import ReportViewer from "./ui/pages/ReportViewer";
import ViewerTemplate from "./ui/templates/ViewerTemplate";
import ProfileVisit from "./ui/pages/ProfileVisit";
import ProfileVisitEditor from "./ui/pages/ProfileVisitEditor";
import VisitViewer from "./ui/pages/VisitViewer";
import AdminUser from "./ui/pages/AdminUser";
import AdminUserEditor from "./ui/pages/AdminUserEditor";
import ProfileSchedule from "./ui/pages/ProfileSchedule";
import ProfileScheduleEditor from "./ui/pages/ProfileScheduleEditor";
import AdminReport from "./ui/pages/AdminReport";
import AdminVisit from "./ui/pages/AdminVisit";
import AdminSchedule from "./ui/pages/AdminSchedule";
import AdminReportViewer from "./ui/pages/AdminReportViewer";
import AdminVisitViewer from "./ui/pages/AdminVisitViewer";
import ProfileSetting from "./ui/pages/ProfileSetting";
import AdminScheduleMap from "./ui/pages/AdminScheduleMap";
import Dealer from "./ui/pages/Dealer";
import DealerTemplate from "./ui/templates/DealerTemplate";
import DealerCabang from "./ui/pages/DealerCabang";
import DealerCabangEditor from "./ui/pages/DealerCabangEditor";
import DealerSchedule from "./ui/pages/DealerSchedule";
import DealerScheduleMap from "./ui/pages/DealerScheduleMap";
import DealerReport from "./ui/pages/DealerReport ";
import DealerVisitViewer from "./ui/pages/DealerVisitViewer";
import DealerReportViewer from "./ui/pages/DealerReportViewer";
import DealerVisit from "./ui/pages/DealerVisit";
import AdminVisualizationInvestigation from "./ui/pages/AdminVisualizationInvestigation";
import AdminVisuzalizationRegular from "./ui/pages/AdminVisualizationRegular";
import DealerVisualizationInvestigation from "./ui/pages/DealerVisualizationInvestigation";
import DealerVisuzalizationRegular from "./ui/pages/DealerVisualizationRegular";
import ImageEditor from "./ui/organisms/ImageEditor";

function App() {

  const routes = [
    // Landing Template Routes
    { path: "/", element: <Home />, type: "landing" },
    { path: "/blog", element: <Blog />, type: "landing" },
    { path: "/article/:id", element: <Article />, type: "landing" },
    { path: "/test", element: <ImageEditor />, type: "view" },


    // Login Route
    { path: "/login", element: <Login />, type: "basic" },

    // Profile
    { path: "/profile", element: <Profile />, type: "profile" },
    { path: "/report", element: <ProfileReport />, type: "profile" },
    { path: "/visit", element: <ProfileVisit />, type: "profile" },
    { path: "/assistant", element: <ProfileReport />, type: "profile" },
    { path: "/warranty", element: <ProfileReport />, type: "profile" },
    
    // Form
    { path: "/report/editor", element: <ProfileReportEditor />, type: "profile" },
    { path: "/report/view/:id", element: <ReportViewer />, type: "viewer" },
    { path: "/report/editor/:id", element: <ProfileReportEditor />, type: "profile" },
    
    { path: "/visit/editor", element: <ProfileVisitEditor />, type: "profile" },
    { path: "/visit/view/:id", element: <VisitViewer />, type: "viewer" },
    { path: "/visit/editor/:id", element: <ProfileVisitEditor />, type: "profile" },
    
    { path: "/schedule", element: <ProfileSchedule />, type: "profile" },
    { path: "/schedule/editor", element: <ProfileScheduleEditor />, type: "profile" },
    { path: "/schedule/editor/:id", element: <ProfileScheduleEditor />, type: "profile" },

    { path: "/setting", element: <ProfileSetting />, type: "profile" },

    // Admin Template Routes
    { path: "/admin/add-article", element: <AdminArticleEditor />, type: "admin" },
    { path: "/admin/edit-article/:id", element: <AdminArticleEditor />, type: "admin" },
    { path: "/admin/article", element: <AdminArticle />, type: "admin" },
    { path: "/admin/user", element: <AdminUser />, type: "admin" },
    { path: "/admin/user/add", element: <AdminUserEditor />, type: "admin" },
    { path: "/admin", element: <Admin />, type: "admin" },
    { path: "/admin/report/visualization", element: <AdminVisualizationInvestigation />, type: "admin" },

    { path: "/admin/report", element: <AdminReport />, type: "admin" },
    { path: "/admin/report/:uid/:id", element: <AdminReportViewer />, type: "viewer" },

    { path: "/admin/visit", element: <AdminVisit />, type: "admin" },
    { path: "/admin/visit/:uid/:id", element: <AdminVisitViewer />, type: "viewer" },
    { path: "/admin/visit/visualization", element: <AdminVisuzalizationRegular />, type: "admin" },

    { path: "/admin/schedule", element: <AdminSchedule />, type: "admin" },
    { path: "/admin/schedule/map", element: <AdminScheduleMap />, type: "admin" },

    // Dealer Template Route
    { path: "/dealer", element: <Dealer />, type: "dealer" },
    { path: "/dealer/cabang", element: <DealerCabang />, type: "dealer" },
    { path: "/dealer/cabang/add", element: <DealerCabangEditor />, type: "dealer" },

    { path: "/dealer/schedule", element: <DealerSchedule />, type: "dealer" },
    { path: "/dealer/schedule/map", element: <DealerScheduleMap />, type: "dealer" },

    { path: "/dealer/report", element: <DealerReport />, type: "dealer" },
    { path: "/dealer/report/:uid/:id", element: <DealerReportViewer />, type: "viewer" },
    { path: "/dealer/report/visualization", element: <DealerVisualizationInvestigation />, type: "dealer" },

    { path: "/dealer/visit", element: <DealerVisit />, type: "dealer" },
    { path: "/dealer/visit/:uid/:id", element: <DealerVisitViewer />, type: "viewer" },
    { path: "/dealer/visit/visualization", element: <DealerVisuzalizationRegular />, type: "dealer" },

    { path: "/dealer/setting", element: <ProfileSetting />, type: "dealer" },

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
            } else if (type === "dealer") {
              return (
                <Route
                  key={index}
                  path={path}
                  element={<DealerTemplate>{element}</DealerTemplate>}
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
