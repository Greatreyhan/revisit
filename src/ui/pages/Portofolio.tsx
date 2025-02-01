import React, { useState, useEffect, useRef, ChangeEvent, useMemo } from "react";
import { FIREBASE_DB } from "../../config/firebaseinit";
import { PortoCard } from "../organisms";
import { onValue, ref as rtdbRef } from "firebase/database";
import { AiOutlineSearch } from "react-icons/ai";

interface PortfolioData {
  id: number;
  title: string;
  tag: string;
  img: string;
  desc: string;
}

const Portofolio: React.FC = () => {
  const [dataPortofolio, setDataPortofolio] = useState<Record<string, PortfolioData>>({});
  const [keyPortofolio, setKeyPortofolio] = useState<string[]>([]);
  const [queryText, setQueryText] = useState<string>("");
  const [filteredKey, setFilteredKey] = useState<string[]>([]);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const portfolioRef = rtdbRef(FIREBASE_DB, "portofolio/");
    onValue(
      portfolioRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log(data)
          const keys = Object.keys(data);
          setKeyPortofolio(keys);
          setDataPortofolio(data);
          setFilteredKey(keys);
        }
      },
      { onlyOnce: true }
    );
  }, []);

  const handleQuery = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQueryText(query);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      const filtered = keyPortofolio.filter((key) =>
        dataPortofolio[key]?.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredKey(filtered);
    }, 300);
  };

  const displayedProjects = useMemo(
    () =>
      filteredKey.map((key) => (
        <PortoCard
          id={key}
          key={key}
          title={dataPortofolio[key].title}
          type={dataPortofolio[key].tag}
          pict={dataPortofolio[key].img}
          desc={dataPortofolio[key].desc}
        />
      )),
    [filteredKey, dataPortofolio]
  );

  const heroSection = useMemo(() => {
    return (
      <div className="w-full pt-32 pb-8">
        <div className="w-10/12 mx-auto flex justify-center items-center text-center">
          <div className="flex-1">
            <h1 className="md:text-4xl text-3xl">
              <span className="text-slate-900 font-bold">DISCOVER OUR WORK</span>
            </h1>
            <p className="text-slate-700 text-sm mt-4 md:w-7/12 w-11/12 mx-auto tracking-wide">
              With years of experience, we transform ideas into impactful solutions. Our portfolio features diverse
              projects—custom software, mobile apps, and integrated systems—crafted to meet each client's unique needs,
              delivering growth and efficiency with precision and creativity. Let our work speak for itself.
            </p>
            <div className="w-full flex justify-center mt-8">
              <form className="md:w-6/12 w-10/12">
                <input
                  value={queryText}
                  onChange={handleQuery}
                  className="w-full px-4 py-3 rounded-full bg-slate-50"
                  type="text"
                  placeholder="Cari Artikel"
                />
              </form>
              <button className="bg-primary rounded-full text-white p-2 ml-2 text-3xl font-semibold">
                <AiOutlineSearch className="text-white w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [queryText]);

  return (
    <div>
      {/* Hero Section */}
      {heroSection}

      {/* Project Show */}
      <div className="w-11/12 mx-auto">
        <div className="flex flex-wrap mt-8 justify-around">{displayedProjects}</div>
      </div>
    </div>
  );
};

export default Portofolio;
