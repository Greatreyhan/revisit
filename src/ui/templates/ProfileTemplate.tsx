import React, { ReactNode } from 'react';
import { Navigate } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import Notification from '../../utils/Notification';
import ProfileNavigation from '../organisms/ProfileNavigation';

interface ProfileTemplateProps {
  children: ReactNode;
}

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({ children }) => {
  const { user, loading } = useFirebase();

  if (loading) {
    return (
      <div className='w-screen h-screen z-50 justify-center items-center flex fixed top-0 left-0 bg-black bg-opacity-20'>
        <div className='loader'></div>
      </div>
    );
  }
  if (user) {
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
  } else {
    return <Navigate to="/login" />
  }
};

export default ProfileTemplate;
