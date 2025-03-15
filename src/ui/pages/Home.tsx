import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeroHome} from "../../assets/images";
import { ServiceCard } from "../organisms";
import { onValue, ref as rtdbref } from "firebase/database";
import { FIREBASE_DB } from "../../config/firebaseinit";
import MiniBlog from "../organisms/MiniBlog";

interface SubserviceItem {
  id: string;
  type: string;
  service: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: string;
  subservice: SubserviceItem[];
}


const transformDataService = (data: Record<string, any>): ServiceItem[] => {
  return Object.entries(data).map(([key, value]) => ({
    id: key,
    title: value.title,
    subtitle: value.subtitle,
    description: value.description,
    image: value.image,
    icon: value.icon,
    subservice: value.subservice
      ? Object.entries(value.subservice).map(([subKey, subValue]) => {
          const subService = subValue as SubserviceItem; // Explicitly type 'subValue'
          return {
            id: subKey,
            type: subService.type,
            service: value.title,
            title: subService.title,
            subtitle: subService.subtitle,
            description: subService.description,
            image: subService.image,
          };
        })
      : [],
  }));
};
const Home: React.FC = () => {
  const [serviceData, setServiceData] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const unsubscribeService = onValue(rtdbref(FIREBASE_DB, "service"), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const transformedData = transformDataService(data);
        setServiceData(transformedData);
      }
    });

    return () => {
      unsubscribeService();    }
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Header Desktop */}
      <div className="bg-slate-50 text-center pt-28 pb-8">
        <h1 className="uppercase text-xl text-base-dark font-normal border border-slate-950 inline-block px-4 py-1 rounded-full">
          Ready To Visit
        </h1>
        <h2 className="uppercase md:text-4xl text-3xl text-base-dark font-bold mt-4">
          One Platform <br />All Solution
        </h2>
        <p className="md:w-6/12 w-9/12 mx-auto mt-2 text-base-light">
        Revisit is designed for field professionals like you, enabling seamless customer interactions to deliver better service and greater value.        </p>

        <div className="mt-6">
          <Link
            to="/report"
            className="bg-primary text-white px-6 py-2.5 rounded-full mx-4"
          >
            Create Report
          </Link>
          <button className="bg-slate-50 text-base-dark px-6 py-2 rounded-full mx-4">
            Learn More
          </button>
        </div>

        <div className="md:mt-8 md:w-10/12 w-full md:h-96 h-48 mx-auto">
          <img
            className="w-full h-full object-contain"
            src={HeroHome}
            alt="Hero"
          />
        </div>
      </div>

      {/* Services */}
      <div className="w-11/12 mx-auto rounded-lg md:px-12 py-8">
        <h2 className="text-center md:text-3xl text-2xl font-normal uppercase text-base-dark pt-24">
          Integrated Solutions for Your Digital Needs
        </h2>
        <p className="mx-auto md:w-5/12 w-11/12 text-center text-base-light mt-4 text-sm">
          From software development to AI implementation,<br />
          our solutions are designed to address the challenges of modern business
        </p>
        <hr className="w-8/12 mx-auto mt-8" />

        <div className="flex flex-wrap">
          {serviceData?.map((e,i) => {
            return (<ServiceCard type={i%2==0?"right":"left"} title={e.title} description={e.description} to={`service/${e.id}`} image={e.image} icon={e.icon} />)
          })}

        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-base-dark w-11/12 md:w-10/12 mx-auto md:p-14 py-8 px-6 rounded-3xl md:text-left text-center">
        <h3 className="md:text-4xl text-3xl text-white uppercase font-semibold">
          Got an Idea?
        </h3>
        <p className="text-sm font-light text-slate-100 mt-2 md:w-6/12">
          Share your vision with us, whether it's a groundbreaking concept or a small improvement. Let's make it happen!
        </p>
        <button className="bg-slate-50 text-base-dark px-6 py-2 rounded-xl mt-5">
          Learn More
        </button>
      </div>

      {/* Articles */}
      <div className="w-full py-8">
        <h2 className="text-center md:text-3xl text-2xl font-normal uppercase text-base-dark pt-8">
          WHAT'S NEW?
        </h2>
        <p className="mx-auto md:w-5/12 w-10/12 text-center text-base-light mt-4 text-sm">
          Discover the latest insights and updates. From industry trends to company news, <br />
          our blog keeps you informed and inspired.
        </p>
        <div className="flex flex-wrap justify-between w-10/12 mx-auto">
        <MiniBlog />
        </div>
      </div>
    </div>
  );
};

export default Home;
