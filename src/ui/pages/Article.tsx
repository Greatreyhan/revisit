import React, { useEffect, useState } from "react";
import { Heroimage } from "../../assets/images";
import { useParams } from "react-router-dom";
import { onValue, ref as rtdbref } from "firebase/database";
import { FIREBASE_DB } from "../../config/firebaseinit";
import parse from "html-react-parser";
import "../styles/PortoStyle.css";

interface DataArt {
  image?: string;
  title?: string;
  subtitle?: string;
  article?: string;
}

const Article: React.FC = () => {
  const [dataArt, setDataArt] = useState<Partial<DataArt>>({});
  const [articleTag, setArticleTag] = useState<string>("");
  const [dateString, setDateString] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    // Fetch data from Firebase
    const dbRef = rtdbref(FIREBASE_DB, "article/" + id);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDataArt(data);
        setArticleTag(data.article || "");
      }
    });

    // Format date
    const date = new Date(parseInt(id, 10));
    const day = date.getDate();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const year = date.getFullYear();
    const daysOfWeek = [
      "Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday",
    ];
    const formattedDate = `${daysOfWeek[date.getDay()]}, ${day} ${monthNames[date.getMonth()]} ${year}`;
    setDateString(formattedDate);
  }, [id]);

  return (
    <div className="article-page">
      <div className="w-full overflow-x-hidden">
        {Object.keys(dataArt).length > 0 && (
          <>
            <div className="w-full">
              <div className="w-full h-96">
                <img
                  className="w-full h-full object-cover"
                  src={dataArt.image || Heroimage}
                  alt={dataArt.title || "Article Image"}
                />
              </div>
              <div className="-mt-48 w-10/12 mx-auto">
                <h2 className="text-white font-bold text-5xl w-8/12">
                  {dataArt.title}
                </h2>
                <p className="text-md text-white">{dateString}</p>
              </div>
            </div>
            <div className="md:w-7/12 w-11/12 mx-auto mt-28">
              <h2 className="font-bold text-4xl mt-40">{dataArt.subtitle}</h2>
              <div className="mt-8 componentArt">
                {articleTag ? parse(articleTag) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Article;
