import React, { useEffect, useState } from "react";
import { Article } from "../interface/Article";
import { useFirebase } from "../../utils/FirebaseContext";



const Admin: React.FC = () => {
  const {getFromDatabase} = useFirebase()
  const [keyArticle, setKeyArticle] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string[]>([]);


  useEffect(() => {

    // Fetch articles
    getFromDatabase("article").then(data => {
      const dataConverted: Article | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setKeyArticle(keys);
      }
    });

    // Fetch portfolios
    getFromDatabase("user").then(data => {
      if (data) {
        const keys = Object.keys(data);
        setKeyData(keys);
      }
    });

  }, []);

  return (
    <div className="w-10/12 mx-auto flex flex-wrap justify-start pt-16 gap-10 bg-white">
      {/* Display Number of Articles */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Artikel</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {keyArticle.length}
          <span className="text-sm font-light ml-2">artikel</span>
        </p>
      </div>

      {/* Display Number of Portfolios */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total User</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {keyData.length}
          <span className="text-sm font-light ml-2">user</span>
        </p>
      </div>

    </div>
  );
};

export default Admin;
