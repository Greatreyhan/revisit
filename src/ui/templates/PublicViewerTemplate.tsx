import React, { ReactNode } from 'react';
import { useFirebase } from "../../utils/FirebaseContext";
import Loading from '../molecules/Loading';

interface PublicViewerTemplateProps {
  children: ReactNode;
}

const PublicViewerTemplate: React.FC<PublicViewerTemplateProps> = ({ children }) => {
  const { loading } = useFirebase();

  if (loading) {
    return (
      <div className='w-screen h-screen z-40 justify-center items-center flex fixed top-0 left-0 bg-black bg-opacity-20'>
        <Loading />
      </div>
    );
  }
  else {
    return (
      <div className="flex w-screen ">
          {children}
      </div>
    );
  }
};

export default PublicViewerTemplate;
