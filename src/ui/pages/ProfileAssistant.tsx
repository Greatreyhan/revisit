import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";

interface AssistantData {
  title: string;
  tag: string;
  desc: string;
}

const ProfileAssistant = () => {
  const {getFromDatabase, deleteFromDatabase } = useFirebase();
  const [dataArticle, setDataArticle] = useState<{ [key: string]: AssistantData }>({});
  const [keyArticle, setKeyArticle] = useState<string[]>([]);

  useEffect(() => {
    getFromDatabase(`article`).then((data) => {
      if (data) {
        const key = Object.keys(data);
        setKeyArticle(key);
        setDataArticle(data);
      }
    });
  }, []);

  return (
    <div className="w-10/12 mx-auto pt-8">
      <div className="flex items-center justify-between py-8">
        <p>Total Visit: {keyArticle.length}</p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/admin/add-article"}
        >
          <span className="text-2xl mr-2">+</span>Add
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">#</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Title</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Tag</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Desc</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {keyArticle.map((key, i) => (
              <tr key={key} className="text-gray-700">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.title}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.tag}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.desc}</td>
                <td className="border-t p-4 flex gap-x-3 justify-around items-center">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/admin/edit-article/" + key}
                  >
                    <MdEdit />
                  </Link>
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => deleteFromDatabase("article/"+key)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileAssistant;
