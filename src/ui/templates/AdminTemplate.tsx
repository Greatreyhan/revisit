import React, { ReactNode } from 'react';
import AdminNavigation from '../organisms/AdminNavigation';
import { Navigate } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import Notification from '../../utils/Notification';
import Loading from '../molecules/Loading';
import { FaClipboardUser } from 'react-icons/fa6';

interface AdminTemplateProps {
  children: ReactNode;
}


const AdminTemplate: React.FC<AdminTemplateProps> = ({ children }) => {
  const { user, loading, authData, waiting } = useFirebase();


  if (loading || authData.type === "") {
    waiting(true)
    return (
      <div className='w-screen h-screen z-50 justify-center items-center flex fixed top-0 left-0 bg-black bg-opacity-20'>
        <Loading />
      </div>
    );
  }
  if (user && authData?.type === "Admin") {
    waiting(false)
    return (
      <div className="flex relative w-full">
        <div className='absolute top-2 right-2 hidden md:block'>
          <div className="rounded-xl bg-slate-100 px-6 py-2">
            <div className="flex-row gap-4 flex justify-center items-center">
              <div className="flex-shrink-0">
                <FaClipboardUser className='text-4xl bg-red-700 text-white p-1.5 rounded-full' />
              </div>
              <div className=" flex flex-col">
                <span className="text-lg font-medium text-gray-600">
                  {authData?.name}
                </span>
                <span className="text-xs text-gray-400">
                  {authData?.type}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Notification />
        <div className="md:w-2/12 z-40">
          <AdminNavigation />
        </div>
        <div className="md:w-10/12 w-full md:pt-10">
          {children}
        </div>
      </div>
    );
  }
  if (user && authData?.type === "Field") {
    waiting(false)
    return <Navigate to="/profile" />
  }
  else if (user && authData?.type === "Dealer") {
    waiting(false)
    return <Navigate to="/dealer" />
  }
  else {
    waiting(false)
    return <Navigate to="/login" />
  }
};

export default AdminTemplate;
