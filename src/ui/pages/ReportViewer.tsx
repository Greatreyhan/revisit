import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import { Logo2 } from "../../assets/images";
import { ReportData } from "../interface/Report";
import { useReactToPrint } from "react-to-print";
import "../styles/PrintStyle.css"
import { MdPrint } from "react-icons/md";

const renderTextBlocks = (text?: string) => {
    if (!text) return null;
    return text.split(" ↵").map((line, index) => (
        <p key={index} className="mb-2">{line}</p>
    ));
};

const ReportViewer: React.FC = () => {
    const { user, getFromDatabase } = useFirebase()
    const { id } = useParams<{ uid: string, id: string }>();

    // Print
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    // Context
    const [dataReport, setDataReport] = useState<ReportData>()

    useEffect(() => {
        if (id) {
            getFromDatabase(`report/${user?.uid}/${id}`).then((data) => {
                if (data) {
                    setDataReport(data);
                }
            });
        }
    }, [id]);


    return (
        <div ref={contentRef} className="py-8 px-16 w-full">
            {/* Button to print */}
            <div onClick={() => reactToPrintFn()} className="fixed cursor-pointer button-print z-50 bottom-6 right-6 bg-red-700 text-white p-3 w-16 h-16 flex justify-center items-center rounded-full">
                <button type="button">
                    <MdPrint className="text-3xl" />
                </button>
            </div>
            <div className="flex items-center justify-between p-4">
                <div>
                    <img src={Logo2} className="w-32" />
                </div>
                <div className="flex justify-end ml-auto">
                    <table className="text-sm mt-8">
                        <tbody>
                            <tr className="text-left">
                                <td className="pr-4">No. Form</td>
                                <td>: FORM/Q/17/03</td>
                            </tr>
                            <tr className="text-left">
                                <td className="pr-4">Div/Dept</td>
                                <td>: UBS/T&W</td>
                            </tr>
                            <tr className="text-left">
                                <td className="pr-4">Rev.</td>
                                <td>: 2</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <hr className="border" />
            <hr className="mt-0.5 border" />

            <div className="mt-4 flex">
                <div className="w-full">
                    <p className="font-semibold text-sm">*Title/Judul</p>
                    <p className="text-xl p-1 mt-2">{dataReport?.largeClassification + " " + dataReport?.middleClassification + " " + dataReport?.partProblem + " " + dataReport?.focusModel + " " + dataReport?.euroType}</p>
                </div>
                <div className="w-2/12 p-1 text-center border">
                    <p className="font-bold text-sm">Created</p>
                    <p className="text-xl">{dataReport?.visitor}</p>
                </div>
                <div className="w-2/12 p-1 text-center border">
                    <p className="font-bold text-sm">Reviewed</p>
                    <p className="text-xl">{dataReport?.reviewer}</p>
                </div>
                <div className="w-2/12 p-1 text-center border">
                    <p className="font-bold text-sm">Approved</p>
                    <p className="text-xl">{dataReport?.approval}</p>
                </div>
            </div>

            {/* Basic Information */}
            <div className="avoid-break">
                <p className="font-semibold text-sm">*Basic Information</p>
                <div className="flex">
                    <div className="w-3/12 border text-center m-1">
                        <p className="text-sm border-b p-1 font-semibold">Customer Name</p>
                        <p className="p-1 text-sm">{dataReport?.customerName}</p>
                    </div>
                    <div className="w-3/12 border text-center m-1">
                        <p className="text-sm border-b p-1 font-semibold">Dealer</p>
                        <p className="p-1 text-sm">{dataReport?.dealer}</p>
                    </div>
                    <div className="w-2/12 border text-center m-1">
                        <p className="text-sm border-b p-1 font-semibold">Where Location</p>
                        <p className="p-1 text-sm">{dataReport?.location}</p>
                    </div>
                    <div className="w-2/12 border text-center m-1">
                        <p className="text-sm border-b p-1 font-semibold">Unit Type</p>
                        <p className="p-1 text-sm">{dataReport?.vehicleType}</p>
                    </div>
                    <div className="w-2/12 border text-center m-1">
                        <p className="text-sm border-b p-1 font-semibold">EG Number</p>
                        <p className="p-1 text-sm">{dataReport?.EGN}</p>
                    </div>
                </div>
                <div className="flex">
                    <div className="w-3/12 border text-center m-1">
                        <p className="text-sm font-semibold p-1 border-b">VIN No.</p>
                        <p className="p-1 text-sm">{dataReport?.VIN}</p>
                    </div>
                    <div className="w-3/12 border text-center m-1">
                        <p className="text-sm font-semibold p-1 border-b">Production Date</p>
                        <p className="p-1 text-sm">{dataReport?.productionDate}</p>
                    </div>
                    <div className="w-2/12 border text-center m-1">
                        <p className="text-sm font-semibold p-1 border-b">Mileage (KM)</p>
                        <p className="p-1 text-sm">{dataReport?.mileage}</p>
                    </div>
                    <div className="w-2/12 border text-center m-1">
                        <p className="text-sm font-semibold p-1 border-b">Karoseri</p>
                        <p className="p-1 text-sm">{dataReport?.karoseri}</p>
                    </div>
                    <div className="w-2/12 border text-center m-1">
                        <p className="text-sm font-semibold p-1 border-b">Payload (KG)</p>
                        <p className="p-1 text-sm">{dataReport?.payload}</p>
                    </div>
                </div>
                <div className="flex">
                    <div className="w-3/12 border text-center m-1">
                        <p className="text-sm font-semibold p-1 border-b">Rear Body Type</p>
                        <p className="p-1 text-sm">{dataReport?.application}</p>
                    </div>
                    <div className="w-3/12 border text-center m-1">
                        <p className="text-sm font-semibold p-1 border-b">Industrial Segment</p>
                        <p className="p-1 text-sm">{dataReport?.segment}</p>
                    </div>
                    <div className="w-2/12 border text-center m-1">
                        <p className="text-sm font-semibold p-1 border-b">Loading Type</p>
                        <p className="p-1 text-sm">{dataReport?.loadingUnit}</p>
                    </div>
                    <div className="w-2/12 m-1">
                        <div className="w-full border text-center">
                            <p className="text-sm font-semibold p-1 border-b">Problem</p>
                            <p className="p-1 text-sm">{dataReport?.problemDate}</p>
                        </div>
                        <div className="w-full border text-center">
                            <p className="text-sm font-semibold p-1 border-b">Visit</p>
                            <p className="p-1 text-sm">{dataReport?.visitDate}</p>
                        </div>
                    </div>
                    <div className="w-2/12 border text-center m-1">
                        <p className="text-sm font-semibold p-1 border-b">Status</p>
                        <p className="p-1 text-sm">{dataReport?.status}</p>
                    </div>
                </div>
            </div>

            {/* Customer Information */}
            <div className="avoid-break">
                <p className="font-semibold text-sm">*Customer Information</p>
                <div className="overflow-x-auto flex">
                    <table className="border-collapse border border-gray-400 w-9/12">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2 text-sm">Merk</th>
                                <th className="border border-gray-400 px-4 py-2 text-sm">Type Unit</th>
                                <th className="border border-gray-400 px-4 py-2 text-sm">Qty (Units)</th>
                                <th className="border border-gray-400 px-4 py-2 text-sm">Goods</th>
                                <th className="border border-gray-400 px-4 py-2 text-sm">Route</th>
                                <th className="border border-gray-400 px-4 py-2 text-sm">Distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataReport?.units?.map((unit, index) => (
                                <tr key={index} className="even:bg-gray-100">
                                    <td className="border border-gray-400 px-4 text-center py-2 text-sm">{unit?.trademark}</td>
                                    <td className="border border-gray-400 px-4 text-center py-2 text-sm">{unit?.typeUnit}</td>
                                    <td className="border border-gray-400 px-4 text-center py-2 text-sm">{unit?.qtyUnit}</td>
                                    <td className="border border-gray-400 px-4 text-center py-2 text-sm">{unit?.goodType}</td>
                                    <td className="border border-gray-400 px-4 text-center py-2 text-sm">{unit?.route}</td>
                                    <td className="border border-gray-400 px-4 text-center py-2 text-sm">{unit?.distance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <table className="w-3/12 border-collapse border border-gray-400">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2 text-sm" colSpan={2}>Road Condition (%)</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="even:bg-gray-100">
                                <td className="border border-gray-400 px-4 py-2">Highway</td>
                                <td className="border border-gray-400 px-4 py-2">{dataReport?.highway}</td>
                            </tr>
                            <tr className="even:bg-gray-100">
                                <td className="border border-gray-400 px-4 py-2">City Road</td>
                                <td className="border border-gray-400 px-4 py-2">{dataReport?.cityRoad}</td>
                            </tr>
                            <tr className="even:bg-gray-100">
                                <td className="border border-gray-400 px-4 py-2">Country Road</td>
                                <td className="border border-gray-400 px-4 py-2">{dataReport?.countryRoad}</td>
                            </tr>
                            <tr className="even:bg-gray-100">
                                <td className="border border-gray-400 px-4 py-2">On Road</td>
                                <td className="border border-gray-400 px-4 py-2">{dataReport?.onRoad}</td>
                            </tr>
                            <tr className="even:bg-gray-100">
                                <td className="border border-gray-400 px-4 py-2">Off Road</td>
                                <td className="border border-gray-400 px-4 py-2">{dataReport?.offRoad}</td>
                            </tr>
                            <tr className="even:bg-gray-100">
                                <td className="border border-gray-400 px-4 py-2">Flat Road</td>
                                <td className="border border-gray-400 px-4 py-2">{dataReport?.flatRoad}</td>
                            </tr><tr className="even:bg-gray-100">
                                <td className="border border-gray-400 px-4 py-2">Climb Road</td>
                                <td className="border border-gray-400 px-4 py-2">{dataReport?.climbRoad}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            {/* Problem Background */}
            <div className="avoid-break">
                <p className="font-semibold text-sm">*Problem Background</p>
                <div className="overflow-x-auto flex text-sm">
                    <table className="w-full border border-gray-300 ">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="border border-gray-300 p-2" colSpan={2}>1. Phenomenon</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-2">{renderTextBlocks(dataReport?.phenomenon)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="w-3/12 border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="border border-gray-300 p-2 text-center" colSpan={2}>Unit Involve</th>
                            </tr>
                            <tr className="bg-gray-100 text-left">
                                <th className="border border-gray-300 p-2 text-center">VIN</th>
                                <th className="border border-gray-300 p-2 text-center">Mileage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataReport?.unitInvolves?.map((row, key) => (
                                <tr key={key} className="text-center">
                                    <td className="border border-gray-300 p-2">{row?.VIN}</td>
                                    <td className="border border-gray-300 p-2">{row?.mileage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <table className="w-full border border-gray-300 ">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="border border-gray-300 p-2" colSpan={2}>2. History maintenance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-2">{renderTextBlocks(dataReport?.historyMaintenance)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <table className="w-full border border-gray-300 ">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="border border-gray-300 p-2" colSpan={2}>3. FA Result Temporary Investigation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-2">{renderTextBlocks(dataReport?.FATemporaryInvestigation)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Content of Investigation */}
            <div className="avoid-break overflow-x-auto">
                <p className="font-semibold mt-4 text-sm">*Contents of Investigation</p>

                <table className="w-full border-collapse border border-gray-400 text-sm">
                    <thead>
                        <tr className="bg-gray-300 text-black">
                            <th className="border border-gray-400 px-4 py-2 text-center">#</th>
                            <th className="border border-gray-400 px-4 py-2 text-center">Contents</th>
                            <th className="border border-gray-400 px-4 py-2 text-center">Result</th>
                            <th className="border border-gray-400 px-4 py-2 text-center">Standard</th>
                            <th className="border border-gray-400 px-4 py-2 text-center">Judge</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataReport?.investigations?.map((row, index) => (
                            <tr key={index} className={index % 2 === 1 ? "bg-gray-100" : ""}>
                                <td className="border border-gray-400 px-4 py-2 text-center">{index + 1}</td>
                                <td className="border border-gray-400 px-4 py-2">{row.content}</td>
                                <td className="border border-gray-400 px-4 py-2">{row.result}</td>
                                <td className="border border-gray-400 px-4 py-2">{row.standard}</td>
                                <td
                                    className={`border border-gray-400 px-4 py-2 text-center ${row.judge === "NG" ? "text-red-500 font-bold underline" : row.judge === "OK" ? "text-green-600 font-bold" : ""
                                        }`}
                                >
                                    {row.judge}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Attachment */}
            <div className="mt-8">
                <h2 className="font-semibold text-sm">*Content Of Investigation Attachment</h2>
                <div className="flex items-start gap-5 flex-wrap mt-4">
                    {dataReport?.attachments?.map((row, index) => (
                        <div
                            key={index}
                            className="avoid-break border border-gray-300 flex flex-col items-center cursor-pointer"
                            onClick={() => window.open(row.imageAttached, "_blank")}
                        >
                            <img
                                src={row.imageAttached}
                                alt="Unit Involve"
                                className="w-full h-60 object-cover print:max-h-48 print:object-cover"
                            />
                            <div className="bg-gray-300 border-t text-center font-bold p-2 w-full">
                                {row.imageDescription}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Result */}
            <div className="avoid-break">

                <div className="">
                    <div className="mb-4">
                        <h3 className="font-semibold text-sm mt-4">*Investigation Result</h3>
                        <div className="border border-gray-300 p-4">{renderTextBlocks(dataReport?.investigationResult)}</div>

                        <h3 className="font-semibold text-sm mt-4">*Customer voice</h3>
                        <div className="border border-gray-300 p-4">{renderTextBlocks(dataReport?.customerVoice)}</div>

                        <h3 className="font-semibold text-sm mt-4">*Temporary Action</h3>
                        <div className="border border-gray-300 p-4">{renderTextBlocks(dataReport?.temporaryAction)}</div>

                        <h3 className="font-semibold text-sm mt-4">*Homework</h3>
                        <div className="border border-gray-300 p-4">{renderTextBlocks(dataReport?.homework)}</div>

                        <h3 className="font-semibold text-sm mt-4">*Other case Base On TIR</h3>
                        <div className="border border-gray-300 p-4">{renderTextBlocks(dataReport?.otherCaseTIR)}</div>

                        <h3 className="font-semibold text-sm mt-4">*Difficult Point</h3>
                        <div className="border border-gray-300 p-4">{renderTextBlocks(dataReport?.difficultPoint)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportViewer