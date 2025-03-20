import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import { MdDelete } from "react-icons/md";

interface UserData {
  email: string;
  type: string;
  dealer: string;
  location: string;
  name: string;
}

const DealerCabang = () => {
  const {getFromDatabase, deleteFromDatabase, user } = useFirebase();
  const [database, setDatabase] = useState<{ [key: string]: UserData }>({});
  const [keyDatabase, setKeyDatabase] = useState<string[]>([]);

  useEffect(() => {
    getFromDatabase(`cabang/${user?.uid}`).then((data) => {
      if (data) {
        const key = Object.keys(data);
        setKeyDatabase(key);
        setDatabase(data);
      }
    });
  }, []);

  return (
    <div className="w-10/12 mx-auto pt-8">
      <div className="flex items-center justify-between py-8">
        <p>Total Cabang: {keyDatabase.length}</p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/dealer/cabang/add"}
        >
          <span className="text-2xl mr-2">+</span>Add
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">#</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Email</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Username</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Type</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Dealer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Location</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {keyDatabase.map((key, i) => (
              <tr key={key} className="text-gray-700">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{database[key]?.email}</td>
                <td className="border p-4 dark:border-dark-5">{database[key]?.name}</td>
                <td className="border p-4 dark:border-dark-5">{database[key]?.type}</td>
                <td className="border p-4 dark:border-dark-5">{database[key]?.dealer}</td>
                <td className="border p-4 dark:border-dark-5">{database[key]?.location}</td>
                <td className="border-t p-4 flex gap-x-3 justify-around items-center">
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => deleteFromDatabase("user/"+key)}
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

export default DealerCabang;
