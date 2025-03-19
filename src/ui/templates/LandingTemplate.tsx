import React, { ReactNode } from 'react';
import { Footer, Navigation } from '../organisms';
import Loading from '../molecules/Loading';
import { useFirebase } from '../../utils/FirebaseContext';

interface LandingTemplateProps {
  children: ReactNode;
}

const LandingTemplate: React.FC<LandingTemplateProps> = ({ children }) => {
    const { loading, waiting } = useFirebase();
  
  if (loading) {
    waiting(true)
    return (
      <div className='w-screen h-screen z-50 justify-center items-center flex fixed top-0 left-0 bg-black bg-opacity-20'>
        <Loading />
      </div>
    );
  }
  else {
    waiting(false)
    return (
      <div>
        <Navigation />
        {children}
        <Footer />
      </div>
    );
  }

};

export default LandingTemplate;
