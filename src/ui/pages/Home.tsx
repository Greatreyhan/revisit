import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconService1,
  IconService2,
  IconService3,
  IconService4,
  IconService5,
  IconService6,
} from "../../assets/icons";
import { HeroHome, Partner1, Partner2, Partner3, Partner4, Partner5, Partner6, Partner7, Partner8, Partner9, Partner10, Partner11, Partner12, Partner13, Partner14, Partner15, Partner16, Partner17, Partner18, Partner19, Partner20, Partner21, Service1, Service2, Service3, Service4, Service5, Service6 } from "../../assets/images";
import { BlogCard, ServiceCard } from "../organisms";
import { onValue, ref as rtdbref } from "firebase/database";
import { FIREBASE_DB } from "../../config/firebaseinit";
import Slider from 'react-infinite-logo-slider'
import MiniBlog from "../organisms/MiniBlog";


interface ArticleData {
  title: string;
  tag: string;
  image: string;
  desc: string;
}

const Home: React.FC = () => {
  const [dataArt, setDataArt] = useState<Record<string, ArticleData>>({});
  const [keyArticle, setKeyArticle] = useState<string[]>([]);

  useEffect(() => {
    const fetchArticles = () => {
      onValue(rtdbref(FIREBASE_DB, "data"), (snapshot) => {
        const data = snapshot.val() as Record<string, ArticleData> | null;
        if (data) {
          const keys = Object.keys(data);
          setKeyArticle(keys.slice(-3)); // Get the last 3 articles
          setDataArt(data);
        }
      });
    };

    fetchArticles();
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Header Desktop */}
      <div className="bg-slate-50 text-center pt-28 pb-8">
        <h1 className="uppercase text-xl text-base-dark font-normal border border-slate-950 inline-block px-4 py-1 rounded-full">
          PT WIDYA SOLUSI UTAMA
        </h1>
        <h2 className="uppercase text-4xl text-base-dark font-bold mt-4">
          Humanize Business <br />Through Technology
        </h2>
        <p className="w-6/12 mx-auto mt-2 text-base-light">
          WSU is dedicated and passionate about helping businesses thrive
          through technology. We are a local company with a global passion and
          mission.
        </p>

        <div className="mt-6">
          <Link
            to="/contact"
            className="bg-primary text-white px-6 py-2.5 rounded-full mx-4"
          >
            Contact Us
          </Link>
          <button className="bg-slate-50 text-base-dark px-6 py-2 rounded-full mx-4">
            Learn More
          </button>
        </div>

        <div className="mt-8 w-10/12 h-96 mx-auto">
          <img
            className="w-full h-full object-contain"
            src={HeroHome}
            alt="Hero"
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="w-full bg-white">
        <h2 className="text-center text-3xl font-normal uppercase text-base-dark pt-24">
          Clients We Work With
        </h2>

        {/* Clients */}
        <hr className="w-8/12 mx-auto mt-8" />
        <div className="w-full mx-auto flex items-center justify-around">
          <Slider
            width="200px"
            duration={40}
            pauseOnHover={true}
            blurBorders={false}
            blurBorderColor={'#fff'}
          >
            {[Partner1, Partner2, Partner3, Partner4, Partner5, Partner6, Partner7, Partner8, Partner9, Partner10, Partner11, Partner12, Partner13, Partner14, Partner15, Partner16, Partner17, Partner18, Partner19, Partner20, Partner21].map(e => {
              return (<Slider.Slide>
                <div className="flex justify-center items-center h-full w-full px-12 mt-8">
                  <img src={e} className="max-w-full max-h-full object-contain" alt={e} />
                </div>
              </Slider.Slide>)
            })}
          </Slider>
        </div>

      </div>

      {/* Services */}
      <div className="w-11/12 mx-auto rounded-lg px-12 py-8">
        <h2 className="text-center text-3xl font-normal uppercase text-base-dark pt-24">
          Integrated Solutions for Your Digital Needs
        </h2>
        <p className="mx-auto w-5/12 text-center text-base-light mt-4 text-sm">
          From software development to AI implementation,<br />
          our solutions are designed to address the challenges of modern business
        </p>
        <hr className="w-8/12 mx-auto mt-8" />

        <div className="flex flex-wrap">
          {[
            {
              type: "left",
              title: "Custom Software",
              description: "WSU focuses on developing custom software solutions, including website and mobile app creation. We are also experienced in delivering data processing solutions and designing interactive dashboards that provide valuable insights to support your business strategies.",
              to: "/portofolio",
              image: Service1,
              icon: IconService1
            },
            {
              type: "right",
              title: "Document Management System",
              description: "Unlock efficiency with smarter document handling. Say goodbye to cluttered files and endless searches—our Document Management System streamlines workflows, enhances collaboration, and ensures secure. Our DMS is designed   to simplify document handling, so your team can focus on what matters most.",
              to: "/portofolio",
              image: Service2,
              icon: IconService2
            },
            {
              type: "left",
              title: "IoT Installation",
              description: "Transform your operations with connected intelligence. IoT solutions bridge the gap between the physical and digital worlds, providing actionable insights that optimize performance, reduce downtime, and enable seamless automation in real-time.",
              to: "/portofolio",
              image: Service3,
              icon: IconService3
            },
            {
              type: "right",
              title: "Product License Procurement",
              description: "Simplify your licensing needs with our one-door solution. We act as your trusted bridge, providing the right licensed products tailored to your requests. From sourcing to procurement, we ensure a seamless process, so you can focus on your core business while we handle the rest.",
              to: "/portofolio",
              image: Service4,
              icon: IconService4
            },
            {
              type: "left",
              title: "Digital Marketing",
              description: "Boost your online presence with data-driven strategies that deliver measurable results. Our strategies are designed to boost your brand visibility, drive targeted traffic, and convert leads into loyal customers in a rapidly evolving online landscape. From content creation to campaign execution, we help you connect with the right audience and grow your digital footprint. ",
              to: "/portofolio",
              image: Service5,
              icon: IconService5
            },
            {
              type: "right",
              title: "AI Implementation",
              description: "Revolutionize your business with intelligent automation. From predictive analytics to smart decision-making, AI turns data into actionable insights, helping you stay ahead of the competition and create unparalleled value for your clients.",
              to: "/portofolio",
              image: Service6,
              icon: IconService6
            },
          ].map(e => {
            return (<ServiceCard type={e.type} title={e.title} description={e.description} to={e.to} image={e.image} icon={e.icon} />)
          })}

        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-800 w-10/12 mx-auto p-14 rounded-3xl">
        <h3 className="text-4xl text-white uppercase font-semibold">
          Got an Idea?
        </h3>
        <p className="text-sm font-light text-slate-100 mt-2 w-6/12">
          Share your vision with us, whether it's a groundbreaking concept or a small improvement. Let's make it happen!
        </p>
        <button className="bg-slate-50 text-base-dark px-6 py-2 rounded-xl mt-5">
          Learn More
        </button>
      </div>

      {/* Articles */}
      <div className="w-full py-8">
        <h2 className="text-center text-3xl font-normal uppercase text-base-dark pt-24">
          WHAT'S NEW?
        </h2>
        <p className="mx-auto w-5/12 text-center text-base-light mt-4 text-sm">
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
