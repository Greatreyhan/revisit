import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete, MdDangerous, MdGppGood } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { ScheduleData } from "../interface/Schedule";

const ProfileSchedule = () => {
  const { getFromDatabase, deleteFromDatabase,user } = useFirebase();
  const [dataArticle, setDataArticle] = useState<{ [key: string]: ScheduleData }>({});
  const [keyArticle, setKeyArticle] = useState<string[]>([]);

  useEffect(() => {
    getFromDatabase(`schedule/`+user?.uid).then((data) => {
      if (data) {
        console.log(data)
        const key = Object.keys(data);
        setKeyArticle(key);
        setDataArticle(data);
      }
    });
  }, []);

  const formatDate = (date:string) => {
    const formDate = new Date(date);
    const datePart = `${formDate.getDate()} ${formDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
  
    return `${datePart}`;
  };

  return (
    <div className="w-10/12 mx-auto pt-8">

      <div className="flex items-center justify-between py-8">
        <p>Total Schedule: {keyArticle.length}</p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/schedule/editor"}
        >
          <span className="text-2xl mr-2">+</span>Create Schedule
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Customer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Date</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Address</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Status</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {keyArticle.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.customer}</td>
                <td className="border-b p-4 dark:border-dark-5 flex flex-col h-full gap-1 items-center justify-center"><span className="bg-sky-100 px-4 py-1 rounded-lg">{formatDate(dataArticle[key]?.dateStart)}</span><span className="bg-rose-100 px-4 py-1 rounded-lg">{formatDate(dataArticle[key]?.dateEnd)}</span></td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.address}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.status == 'pending' ? <MdDangerous className="w-full text-xl text-rose-700" /> : <MdGppGood className="w-full text-xl text-emerald-700" />}</td>
                <td className="border-t p-4 gap-x-3 flex justify-around items-center">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/schedule/editor/" + key}
                  >
                    <MdEdit />
                  </Link>
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => deleteFromDatabase("schedule/" + user?.uid + "/" + key)}
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

export default ProfileSchedule;
