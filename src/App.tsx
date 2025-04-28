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
import AdminCache from "./ui/pages/AdminCache";
import ProfileCustomer from "./ui/pages/ProfileCustomer";
import ProfileHealth from "./ui/pages/ProfileHealth";
import ProfileTraining from "./ui/pages/ProfileTraining";
import ProfileHealthEditor from "./ui/pages/ProfileHealthEditor";
import ProfileTrainingEditor from "./ui/pages/ProfileTrainingEditor";
import ProfileCustomerEditor from "./ui/pages/ProfileCustomerEditor";
import ProfilePodium from "./ui/pages/ProfilePodium";
import DealerPodium from "./ui/pages/DealerPodium";
import DealerCustomer from "./ui/pages/DealerCustomer";
import DealerHealth from "./ui/pages/DealerHealth";
import DealerTraining from "./ui/pages/DealerTraining";
import DealerSetting from "./ui/pages/DealerSetting";
import AdminPodium from "./ui/pages/AdminPodium";
import AdminCustomer from "./ui/pages/AdminCustomer";
import AdminHealth from "./ui/pages/AdminHealth";
import AdminTraining from "./ui/pages/AdminTraining";
import DealerCustomerEditor from "./ui/pages/DealerCustomerEditor";
import DealerTrainingEditor from "./ui/pages/DealerTrainingEditor";
import DealerHealthEditor from "./ui/pages/DealerHealthEditor";
import TestSort from "./ui/organisms/TestSort";


const NotFound: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-screen">
    <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
    <p className="mt-2">Maaf, halaman yang Anda cari tidak tersedia.</p>
  </div>
);

function App() {
  const routes = [
    // Landing Template Routes
    { path: '/', element: <Home />, layout: 'landing' },
    { path: '/blog', element: <Blog />, layout: 'landing' },
    { path: '/article/:id', element: <Article />, layout: 'landing' },
    { path: '/test', element: <ImageEditor />, layout: 'view' },

    // Login
    { path: '/login', element: <Login />, layout: 'basic' },

    // Profile
    { path: '/profile', element: <Profile />, layout: 'profile' },
    { path: '/report', element: <ProfileReport />, layout: 'profile' },
    { path: '/visit', element: <ProfileVisit />, layout: 'profile' },
    { path: '/assistant', element: <ProfileReport />, layout: 'profile' },
    { path: '/warranty', element: <ProfileReport />, layout: 'profile' },
    { path: '/customer', element: <ProfileCustomer />, layout: 'profile' },
    { path: '/health', element: <ProfileHealth />, layout: 'profile' },
    { path: '/training', element: <ProfileTraining />, layout: 'profile' },
    { path: '/podium', element: <ProfilePodium />, layout: 'profile' },

    // Field Editors & Viewers
    { path: '/report/editor', element: <ProfileReportEditor />, layout: 'profile' },
    { path: '/report/view/:id', element: <ReportViewer />, layout: 'viewer' },
    { path: '/report/editor/:id', element: <ProfileReportEditor />, layout: 'profile' },
    { path: '/visit/editor', element: <ProfileVisitEditor />, layout: 'profile' },
    { path: '/visit/view/:id', element: <VisitViewer />, layout: 'viewer' },
    { path: '/visit/editor/:id', element: <ProfileVisitEditor />, layout: 'profile' },
    { path: '/schedule', element: <ProfileSchedule />, layout: 'profile' },
    { path: '/schedule/editor', element: <ProfileScheduleEditor />, layout: 'profile' },
    { path: '/schedule/editor/:id', element: <ProfileScheduleEditor />, layout: 'profile' },
    { path: '/health/editor', element: <ProfileHealthEditor />, layout: 'profile' },
    { path: '/health/editor/:id', element: <ProfileHealthEditor />, layout: 'profile' },
    { path: '/training/editor', element: <ProfileTrainingEditor />, layout: 'profile' },
    { path: '/training/editor/:id', element: <ProfileTrainingEditor />, layout: 'profile' },
    { path: '/customer/editor', element: <ProfileCustomerEditor />, layout: 'profile' },
    { path: '/customer/editor/:id', element: <ProfileCustomerEditor />, layout: 'profile' },
    { path: '/setting', element: <ProfileSetting />, layout: 'profile' },

    // Admin Routes
    { path: '/admin/add-article', element: <AdminArticleEditor />, layout: 'admin' },
    { path: '/admin/edit-article/:id', element: <AdminArticleEditor />, layout: 'admin' },
    { path: '/admin/article', element: <AdminArticle />, layout: 'admin' },
    { path: '/admin/user', element: <AdminUser />, layout: 'admin' },
    { path: '/admin/cache', element: <AdminCache />, layout: 'admin' },
    { path: '/admin/user/add', element: <AdminUserEditor />, layout: 'admin' },
    { path: '/admin', element: <Admin />, layout: 'admin' },
    { path: '/admin/report/visualization', element: <AdminVisualizationInvestigation />, layout: 'admin' },
    { path: '/admin/report', element: <AdminReport />, layout: 'admin' },
    { path: '/admin/report/:uid/:id', element: <AdminReportViewer />, layout: 'viewer' },
    { path: '/admin/visit', element: <AdminVisit />, layout: 'admin' },
    { path: '/admin/visit/:uid/:id', element: <AdminVisitViewer />, layout: 'viewer' },
    { path: '/admin/visit/visualization', element: <AdminVisuzalizationRegular />, layout: 'admin' },
    { path: '/admin/schedule', element: <AdminSchedule />, layout: 'admin' },
    { path: '/admin/schedule/map', element: <AdminScheduleMap />, layout: 'admin' },
    { path: '/admin/podium', element: <AdminPodium />, layout: 'admin' },
    { path: '/admin/customer', element: <AdminCustomer />, layout: 'admin' },
    { path: '/admin/health', element: <AdminHealth />, layout: 'admin' },
    { path: '/admin/training', element: <AdminTraining />, layout: 'admin' },

    // Dealer Routes
    { path: '/dealer', element: <Dealer />, layout: 'dealer' },
    { path: '/dealer/cabang', element: <DealerCabang />, layout: 'dealer' },
    { path: '/dealer/cabang/add', element: <DealerCabangEditor />, layout: 'dealer' },
    { path: '/dealer/schedule', element: <DealerSchedule />, layout: 'dealer' },
    { path: '/dealer/schedule/map', element: <DealerScheduleMap />, layout: 'dealer' },
    { path: '/dealer/report', element: <DealerReport />, layout: 'dealer' },
    { path: '/dealer/report/:uid/:id', element: <DealerReportViewer />, layout: 'viewer' },
    { path: '/dealer/report/visualization', element: <DealerVisualizationInvestigation />, layout: 'dealer' },
    { path: '/dealer/visit', element: <DealerVisit />, layout: 'dealer' },
    { path: '/dealer/visit/:uid/:id', element: <DealerVisitViewer />, layout: 'viewer' },
    { path: '/dealer/visit/visualization', element: <DealerVisuzalizationRegular />, layout: 'dealer' },
    { path: '/dealer/setting', element: <DealerSetting />, layout: 'dealer' },
    { path: '/dealer/podium', element: <DealerPodium />, layout: 'dealer' },
    { path: '/dealer/customer', element: <DealerCustomer />, layout: 'dealer' },
    { path: '/dealer/customer/:uid/:id', element: <DealerCustomerEditor />, layout: 'dealer' },
    { path: '/dealer/health', element: <DealerHealth />, layout: 'dealer' },
    { path: '/dealer/health/:uid/:id', element: <DealerHealthEditor />, layout: 'dealer' },
    { path: '/dealer/training', element: <DealerTraining />, layout: 'dealer' },
    { path: '/dealer/training/:uid/:id', element: <DealerTrainingEditor />, layout: 'dealer' },

    { path: '/dnd', element: <TestSort />, layout: 'profile' },

    // Catch-all 404
    { path: '*', element: <NotFound />, layout: 'basic' },
  ];

  return (
    <FirebaseProvider>
      <BrowserRouter>
        <Routes>
          {routes.map(({ path, element, layout }, index) => {
            switch (layout) {
              case 'landing':
                return <Route key={index} path={path} element={<LandingTemplate>{element}</LandingTemplate>} />;
              case 'admin':
                return <Route key={index} path={path} element={<AdminTemplate>{element}</AdminTemplate>} />;
              case 'dealer':
                return <Route key={index} path={path} element={<DealerTemplate>{element}</DealerTemplate>} />;
              case 'profile':
                return <Route key={index} path={path} element={<ProfileTemplate>{element}</ProfileTemplate>} />;
              case 'viewer':
                return <Route key={index} path={path} element={<ViewerTemplate>{element}</ViewerTemplate>} />;
              default:
                return <Route key={index} path={path} element={element} />;
            }
          })}
        </Routes>
      </BrowserRouter>
    </FirebaseProvider>
  );
}

export default App;
