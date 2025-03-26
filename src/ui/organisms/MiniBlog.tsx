import React, { useEffect, useState } from "react";
import { BlogCard } from "../organisms";
import { onValue, ref as rtdbRef } from "firebase/database";
import { FIREBASE_DB } from "../../config/firebaseinit";

interface ArticleData {
  title: string;
  tag: string;
  image: string;
  desc: string;
}

const MiniBlog: React.FC = () => {
  const [dataArt, setDataArt] = useState<Record<string, ArticleData>>({});
  const [keyArticle, setKeyArticle] = useState<string[]>([]);

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

  // Get top 3 articles
  const topArticles = keyArticle.slice(0, 3);

  return (
    <div className="w-full mx-auto overflow-x-hidden">

      {/* Articles */}
      <div className="w-11/12 mx-auto py-8 flex flex-wrap md:justify-between justify-center gap-5">
        {topArticles.map((key) => (
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

export default MiniBlog;
