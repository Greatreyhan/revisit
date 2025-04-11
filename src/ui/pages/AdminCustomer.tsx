import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdClose, MdDownload } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { useFirebase } from "../../utils/FirebaseContext";
import { CustomerData } from "../interface/Customer";
import * as XLSX from "xlsx";

const AdminCustomer = () => {
  const { getFromDatabase, user } = useFirebase();
  const [dataArticle, setDataArticle] = useState<Record<string, CustomerData>>({});
  const [keyArticle, setKeyArticle] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string>("");

  const handleExportData = () => {
    // Ubah dataArticle yang berbentuk objek menjadi array objek dengan Object.entries()
    const dataArr = Object.entries(dataArticle).map(([key, customer]) => {
      // Destruktur untuk menangani properti yang akan kita ubah tampilannya
      const { units, locationMap, ...rest } = customer;
  
      // Jika units berupa array, kita buat representasi string:
      // Misal: "Unit 1: {field: value}, Unit 2: {field: value}"
      const unitsString =
        Array.isArray(units) && units.length > 0
          ? units
              .map((unit, index) => `Unit ${index + 1}: ${JSON.stringify(unit)}`)
              .join("; ")
          : "";
  
      // Konversi objek locationMap menjadi string JSON, atau kosong jika undefined
      const locationMapString = locationMap ? JSON.stringify(locationMap) : "";
  
      // Hitung total unit jika terdapat data pada customer.units
      const totalUnits = Array.isArray(units)
        ? units.reduce((total, unit) => total + Number(unit.qtyUnit), 0)
        : 0;
  
      return {
        CustomerID: key,
        ...rest,
        TotalUnits: totalUnits,
        Units: unitsString,
        LocationMap: locationMapString,
      };
    });
  
    // Konversi array data ke sheet Excel
    const worksheet = XLSX.utils.json_to_sheet(dataArr);
    // Buat workbook baru
    const workbook = XLSX.utils.book_new();
    // Tambahkan sheet ke workbook dengan nama "Customers"
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    // Simpan file Excel dengan nama "customers.xlsx"
    XLSX.writeFile(workbook, "customers.xlsx");
  };
  


  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user?.uid) return;

      try {
        // Ambil seluruh data customer tanpa filter cabang
        const customerData = await getFromDatabase("customer/");
        if (!customerData) return;

        // Persiapkan objek untuk menyimpan customer yang telah diproses.
        const filteredCustomers: Record<string, CustomerData & { customerId: string; cabangId: string }> = {};

        // Struktur data customer misalnya: { cabangId: { customerId: customerDetail, ... } }
        Object.entries(customerData).forEach(([cabangId, customersObj]) => {
          Object.entries(customersObj as Record<string, any>).forEach(([customerId, customerDetail]) => {
            filteredCustomers[customerId] = {
              ...customerDetail,
              customerId,
              cabangId,
            };
          });
        });

        console.log(filteredCustomers)

        setDataArticle(filteredCustomers);
        setKeyArticle(Object.keys(filteredCustomers));
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }

    };

    fetchCustomerData();
  }, [user?.uid, getFromDatabase]);

  return (
    <div className="w-10/12 mx-auto pt-8">
      {/* Modal Info Customer */}
      <div
        onClick={() => setKeyData("")}
        className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${keyData === "" ? "hidden" : "flex"
          } justify-center items-center`}
      >
        <div className="pb-6 bg-slate-50 rounded-lg flex flex-col">
          <div className="relative">
            <button onClick={() => setKeyData("")} className="absolute right-0 top-0" type="button">
              <MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" />
            </button>
            <table className="w-full">
              <thead>
                <tr>
                  <td
                    className="font-semibold py-3 px-6 rounded-t-lg bg-slate-100"
                    colSpan={2}
                  >
                    Customer Information
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Nama</td>
                  <td className="w-10/12 p-2">: {dataArticle[keyData]?.customerName}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Area</td>
                  <td className="w-10/12 p-2">: {dataArticle[keyData]?.area}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Units</td>
                  <td className="w-10/12 p-2">
                    :{" "}
                    {dataArticle[keyData]?.units?.reduce(
                      (sum, unit) => sum + (Number(unit.qtyUnit) || 0),
                      0
                    )}
                  </td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Segment</td>
                  <td className="w-10/12 p-2">: {dataArticle[keyData]?.segment}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <Link
                className="text-sky-800 px-4 py-2 rounded-lg bg-sky-100 flex items-center"
                to={"/customer/editor/" + keyData}
              >
                <MdEdit className="text-md mr-1" />
                <p className="text-sm">Edit Data</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-8">
        <p>Total Customer: {keyArticle.length}</p>
        <button
          onClick={handleExportData}
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
        >
          <span className="text-2xl mr-2"><MdDownload /></span>
          Export Data
        </button>
      </div>
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Nama</th>
              <th className="border p-4 whitespace-nowrap text-gray-900 md:table-cell hidden">
                Segment
              </th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Type</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Unit</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {keyArticle.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4">{i + 1}</td>
                <td className="border p-4">{dataArticle[key]?.customerName}</td>
                <td className="border p-4 md:table-cell hidden">
                  {dataArticle[key]?.segment}
                </td>
                <td className="border p-4">
                  {dataArticle[key]?.typeCustomer}
                </td>
                <td className="border p-4 text-center">
                  {dataArticle[key]?.units?.reduce(
                    (total, unit) => total + parseInt(unit.qtyUnit, 10),
                    0
                  ) || 0}
                </td>
                <td className="border-t p-4 md:flex gap-x-3 justify-around items-center hidden">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/health/editor/" + key}
                  >
                    <MdEdit />
                  </Link>
                </td>
                <td className="border-t p-4 flex gap-x-3 justify-around items-center md:hidden">
                  <button
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    type="button"
                    onClick={() => setKeyData(key)}
                  >
                    <IoMdSettings />
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

export default AdminCustomer;
