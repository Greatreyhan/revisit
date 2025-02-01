import { useEffect, useState } from 'react'
import { MdArrowOutward } from 'react-icons/md'
import { onValue, ref as rtdbref } from "firebase/database";
import { FIREBASE_DB } from "../../config/firebaseinit";

interface CareerItem {
    id: string;
    title: string;
    description: string;
    link: string;
  }

const Career = () => {
    const [careers, setCareers] = useState<Record<string, CareerItem>>({});
    const [careerKeys, setCareerKeys] = useState<string[]>([]);

    useEffect(() => {
        onValue(rtdbref(FIREBASE_DB, "career"), (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const keys = Object.keys(data);
            setCareerKeys(keys);
            setCareers(data);
          }
        });
      }, []);

    return (
        <div className='bg-slate-50 pb-8 '>
            {/* Job Vacancy */}
            <div className="flex md:flex-row flex-col w-10/12 mx-auto relative items-center bg-none py-32">
                <div className="flex-1 text-center md:text-left">
                    <h1 className="md:text-4xl text-3xl font-medium text-base-dark">Opening Position</h1>
                    <p className="text-sm font-light text-base-dark md:mt-2 mt-4 md:w-8/12 w-11/12 md:mx-0 mx-auto">
                        Our team includes skilled, certified engineers located throughout Indonesia. With deep expertise and extensive experience, we are ready to provide effective solutions for your IT challenges.
                    </p>
                </div>
                <div className="flex-1 flex flex-col gap-y-2 md:mt-0 mt-8 md:w-full w-11/12">
                    {careerKeys?.map(
                            (key) => (
                                <a
                                    key={careers[key]?.id}
                                    href={careers[key]?.link}
                                    className="flex bg-white rounded-full px-6 py-3 items-center text-base-dark cursor-pointer hover:text-white hover:bg-primary justify-between"
                                >
                                    <span>{careers[key]?.title}</span>
                                    <MdArrowOutward className="text-xl" />
                                </a>
                            )
                        )}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-base-dark w-10/12 mx-auto p-12 rounded-3xl md:text-left text-center">
                <h3 className="md:text-4xl text-3xl text-white uppercase font-semibold">
                    Find the right position and apply
                </h3>
                <p className="text-sm font-light text-slate-100 md:mt-2 mt-4 md:w-6/12 w-11/12">
                    Contact us now to get started!
                </p>
                <button className="bg-slate-50 text-slate-950 px-6 py-2 rounded-xl mt-5">
                    Send email
                </button>
            </div>
        </div>
    )
}

export default Career