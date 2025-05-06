import React, { useEffect, useState, ChangeEvent, useMemo } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BlogCard } from "../../organisms";
import { onValue, ref as rtdbRef } from "firebase/database";
import { FIREBASE_DB } from "../../../config/firebaseinit";

interface ArticleData {
  title: string;
  tag: string;
  image: string;
  desc: string;
}

const Blog: React.FC = () => {
  const [dataArt, setDataArt] = useState<Record<string, ArticleData>>({});
  const [keyArticle, setKeyArticle] = useState<string[]>([]);
  const [queryText, setQueryText] = useState<string>("");
  const [tagKey, setTagKey] = useState<string>("all");

  useEffect(() => {
    // Listen to Firebase database for articles
    const dbRef = rtdbRef(FIREBASE_DB, "article");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const keys = Object.keys(data);
        setKeyArticle(keys);
        setDataArt(data);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Filtered keys based on queryText and tagKey
  const filteredKey = useMemo(() => {
    let result = keyArticle;

    // Filter by tag
    if (tagKey.toLowerCase() !== "all") {
      result = result.filter((key) =>
        dataArt[key]?.tag?.toLowerCase().includes(tagKey.toLowerCase())
      );
    }

    // Filter by queryText
    if (queryText) {
      result = result.filter((key) =>
        dataArt[key]?.title?.toLowerCase().includes(queryText.toLowerCase())
      );
    }

    return result;
  }, [keyArticle, dataArt, queryText, tagKey]);

  const handleQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQueryText(e.target.value);
  };

  const handleTag = (tagName: string) => {
    setTagKey(tagName);
  };

  return (
    <div className="w-full mx-auto bg-white overflow-x-hidden">
      {/* Title Section */}
      <div className="w-full text-center pt-32">
        <h2 className="md:text-4xl text-3xl font-medium text-slate-900">Read More Articles</h2>
        <p className="text-sm font-light text-slate-800 mt-2 md:w-4/12 w-10/12 mx-auto">
          Our team group of creative people, consisting of various backgrounds and specific abilities that are divided into several divisions.
        </p>
      </div>

      {/* Search and Tag Filters */}
      <div className="w-11/12 mx-auto flex-col items-center mt-8 justify-center">
        <div className="w-full flex justify-center">
          <form className="md:w-6/12 w-10/12">
            <input
              value={queryText}
              onChange={handleQuery}
              className="w-full px-4 py-3 rounded-full bg-base-white"
              type="text"
              placeholder="Cari Artikel"
            />
          </form>
          <button className="bg-primary rounded-full text-white p-2 ml-2 text-3xl font-semibold">
            <AiOutlineSearch className="text-white w-8 h-8" />
          </button>
        </div>
        <div className="flex gap-4 justify-center my-6 flex-wrap">
          {["All", "Hukum", "Perusahaan", "Pertambangan", "Konstruksi"].map(
            (tag, idx) => (
              <span
                key={idx}
                onClick={() => handleTag(tag)}
                className={`px-4 rounded-full text-center cursor-pointer ${
                  tagKey === tag
                    ? "text-white bg-primary"
                    : "border-primary text-primary"
                } py-1.5 border w-36 font-semibold text-sm`}
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>

      {/* Articles */}
      <div className="w-10/12 mx-auto py-16 gap-16 flex flex-wrap md:justify-between justify-center">
        {filteredKey.map((key) => (
          <BlogCard
            key={key}
            title={dataArt[key]?.title}
            tag={dataArt[key]?.tag}
            imgArt={dataArt[key]?.image}
            desc={dataArt[key]?.desc}
            dateTime={key}
          />
        ))}
      </div>
    </div>
  );
};

export default Blog;
