import React, { ReactNode, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import Notification from '../../utils/Notification';
import Loading from '../molecules/Loading';
import DealerNavigation from '../organisms/DealerNavigation';
interface DealerTemplateProps {
  children: ReactNode;
}


const DealerTemplate: React.FC<DealerTemplateProps> = ({ children }) => {
  const { user, loading, authData, waiting } = useFirebase();

  useEffect(() => {
    // Fetch authorization
  }, [authData])

  if (loading || authData.type === "") {
    waiting(true)
    return (
      <div className='w-screen h-screen z-50 justify-center items-center flex fixed top-0 left-0 bg-black bg-opacity-20'>
        <Loading />
      </div>
    );
  }
  if (user && authData?.type === "dealer") {
    waiting(false)
    return (
      <div className="flex w-screen">
        <Notification />
        <div className="md:w-2/12">
          <DealerNavigation />
        </div>
        <div className="md:w-10/12 w-full">
          {children}
        </div>
      </div>
    );
  }
  if (user && authData?.type === "user") {
    waiting(false)
    return <Navigate to="/profile" />
  } 
  else if (user && authData?.type === "admin") {
    waiting(false)
    return <Navigate to="/admin" />
  }
  else {
    waiting(false)
    return <Navigate to="/login" />
  }
};

export default DealerTemplate;
