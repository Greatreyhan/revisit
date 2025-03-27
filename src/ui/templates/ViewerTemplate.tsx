import React, { ReactNode } from 'react';
import { Navigate } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import Loading from '../molecules/Loading';

interface ViewerTemplateProps {
  children: ReactNode;
}

const ViewerTemplate: React.FC<ViewerTemplateProps> = ({ children }) => {
  const { user, loading } = useFirebase();

  if (loading) {
    return (
      <div className='w-screen h-screen z-40 justify-center items-center flex fixed top-0 left-0 bg-black bg-opacity-20'>
        <Loading />
      </div>
    );
  }
  if (user) {
    return (
      <div className="flex w-screen ">
          {children}
      </div>
    );
  } else {
    return <Navigate to="/login" />
  }
};

export default ViewerTemplate;
