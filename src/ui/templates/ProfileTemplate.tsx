import React, { ReactNode, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import Notification from '../../utils/Notification';
import ProfileNavigation from '../organisms/ProfileNavigation';
import Loading from '../molecules/Loading';
interface ProfileTemplateProps {
  children: ReactNode;
}


const ProfileTemplate: React.FC<ProfileTemplateProps> = ({ children }) => {
  const { user, loading, authData, waiting } = useFirebase();

  useEffect(() => {
    // Fetch authorization
  }, [authData])

  if (loading && authData.type === "") {
    waiting(true)
    return (
      <div className='w-screen h-screen z-50 justify-center items-center flex fixed top-0 left-0 bg-black bg-opacity-20'>
        <Loading />
      </div>
    );
  }
  if (!loading && authData.type === "") {
    waiting(false)
    return <Navigate to="/login" />
  }
  if (user && authData.type === "admin") {
    waiting(false)
    return <Navigate to="/admin" />
  }
  if (user && authData.type === "dealer") {
    waiting(false)
    return <Navigate to="/dealer" />
  }
  if (user && authData.type === "user") {
    waiting(false)
    return (
      <div className="flex w-full">
        <Notification />
        <div className="md:w-2/12">
          <ProfileNavigation />
        </div>
        <div className="md:w-10/12 w-full">
          {children}
        </div>
      </div>
    );
  }
  else {
    return <Navigate to="/login" />
  }
};

export default ProfileTemplate;
