import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import { Logo2 } from "../../assets/images";
import { VisitData } from "../interface/Visit";
import MapViewer from "../organisms/MapViewer";

const renderTextBlocks = (text?: string) => {
    if (!text) return null;
    return text.split(" ↵").map((line, index) => (
        <p key={index} className="mb-2">{line}</p>
    ));
};

const VisitViewer: React.FC = () => {
    const { getFromDatabase,user, waiting } = useFirebase()
    const { id } = useParams<{ id: string }>();

    // Context
    const [dataVisit, setDataVisit] = useState<VisitData>()

    useEffect(() => {
        waiting(true)
        if (id) {
            getFromDatabase(`visit/${user?.uid}/${id}`).then((data) => {
                console.log(id)
                if (data) {
                    setDataVisit(data);
                }
            });
        }
        waiting(false)
    }, [id]);


    return (
        <div className="py-8 px-16 w-full">

            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div>
                    <img src={Logo2} className="w-32" />
                </div>
                <table className="w-2/12 text-sm mt-8">

                    <tbody>
                        <tr className="text-left w-full">
                            <td className=" w-4/12">No. Form</td>
                            <td className=" w-8/12">: {id}</td>
                        </tr>
                        <tr className="text-left w-full">
                            <td className=" w-4/12">Div/Dept</td>
                            <td className=" w-8/12">: TWF</td>
                        </tr>
                        <tr className="text-left w-full">
                            <td className=" w-4/12">Rev.</td>
                            <td className=" w-8/12">: 1</td>
                        </tr>

                    </tbody>
                </table>
                {/* <div>
                    <p className="text-sm">No. Form : 12345</p>
                    <p className="text-sm">Div/Dept : TWF</p>
                    <p className="text-sm">Rev. : 2</p>
                </div> */}
            </div>
            <hr className="border" />
            <hr className="mt-0.5 border" />

            {/* General Information */}
            <div className="mt-4 flex justify-around items-center">

                <div className="w-3/12 flex justify-around">
                    <div className="w-4/12 p-1 text-center border">
                        <p className="font-bold text-sm">Created</p>
                        <p className="text-xl uppercase">{dataVisit?.visitor}</p>
                    </div>
                    <div className="w-4/12 p-1 text-center border">
                        <p className="font-bold text-sm">Reviewed</p>
                        <p className="text-xl uppercase">{dataVisit?.reviewer}</p>
                    </div>
                    <div className="w-4/12 p-1 text-center border">
                        <p className="font-bold text-sm">Approved</p>
                        <p className="text-xl uppercase">{dataVisit?.approval}</p>
                    </div>
                </div>


                <div className="w-6/12 text-center font-semibold">
                    <h1 className="text-4xl">Inspection Report</h1>
                </div>

                <table className="w-2/12 text-sm mt-8">

                    <tbody>
                        <tr className="text-left w-full">
                            <td className=" w-4/12">Field</td>
                            <td className=" w-8/12">: {id}</td>
                        </tr>
                        <tr className="text-left w-full">
                            <td className=" w-4/12">Name</td>
                            <td className=" w-8/12">: TWF</td>
                        </tr>
                        <tr className="text-left w-full">
                            <td className=" w-4/12">Visit Date</td>
                            <td className=" w-8/12">: 1</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            {/* Basic Information */}
            <div>
                <div className="flex">
                    <table className="w-full border mt-8">
                        <thead>
                            <tr className="">
                                <td className="font-semibold p-3 border bg-slate-50" colSpan={2}>Customer Information</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-left w-full">
                                <td className=" w-3/12 p-2">Customer Name</td>
                                <td className=" w-10/12 p-2">: {dataVisit?.customerName}</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className=" w-3/12 p-2">Location (City)</td>
                                <td className=" w-10/12 p-2">: {dataVisit?.city}</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className=" w-3/12 p-2">Visitor</td>
                                <td className=" w-10/12 p-2">: {dataVisit?.visitorName}</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className=" w-3/12 p-2">Dealer</td>
                                <td className=" w-10/12 p-2">: {dataVisit?.dealer}</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className=" w-3/12 p-2">Industry Segment</td>
                                <td className=" w-10/12 p-2">: {dataVisit?.segment}</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className=" w-3/12 p-2">Date of Starting Operation</td>
                                <td className=" w-10/12 p-2">: {dataVisit?.dateOperation}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ownership Units */}
            <div>
                <div className="overflow-x-auto flex mt-8">
                    <table className="border-collapse border w-full">
                        <thead>
                            <tr className="">
                                <td className="font-semibold p-3 border bg-slate-50 border-gray-200" colSpan={7}>Owner Units</td>
                            </tr>
                            <tr className="bg-gray-200 border">
                                <th className="border border-gray-200 px-4 py-2 text-sm">Merk</th>
                                <th className="border border-gray-200 px-4 py-2 text-sm">Type Unit</th>
                                <th className="border border-gray-200 px-4 py-2 text-sm">Qty</th>
                                <th className="border border-gray-200 px-4 py-2 text-sm">Rear Body Type</th>
                                <th className="border border-gray-200 px-4 py-2 text-sm">Payload (ton)</th>
                                <th className="border border-gray-200 px-4 py-2 text-sm">Goods</th>
                                <th className="border border-gray-200 px-4 py-2 text-sm">Body Maker</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataVisit?.units.map((unit, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-200 px-4 text-center py-2 text-sm">{unit?.trademark}</td>
                                    <td className="border border-gray-200 px-4 text-center py-2 text-sm">{unit?.typeUnit}</td>
                                    <td className="border border-gray-200 px-4 text-center py-2 text-sm">{unit?.qtyUnit}</td>
                                    <td className="border border-gray-200 px-4 text-center py-2 text-sm">{unit?.rearBodyType}</td>
                                    <td className="border border-gray-200 px-4 text-center py-2 text-sm">{unit?.payload}</td>
                                    <td className="border border-gray-200 px-4 text-center py-2 text-sm">{unit?.goods}</td>
                                    <td className="border border-gray-200 px-4 text-center py-2 text-sm">{unit?.bodyMaker}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>

            {/* Operational */}
            <div>
                <div className="flex">
                    <table className="w-full border mt-8">
                        <thead>
                            <tr className="">
                                <td className="font-semibold p-3 border bg-slate-50" colSpan={2}>Operational</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={2}>
                                    <MapViewer mapMarkers={dataVisit?.mapMarkers ?? []} mapDistance={dataVisit?.mapDistance ?? 0} />
                                    {/* <img className="w-full mb-8" src={dataVisit?.mapAttached} /> */}
                                </td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className=" w-3/12 p-2">Number of day per week</td>
                                <td className=" w-10/12 p-2">: {dataVisit?.dayPerWeek} day</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className=" w-3/12 p-2">Number of trip per day</td>
                                <td className=" w-10/12 p-2">: {dataVisit?.tripPerDay} trip</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className=" w-3/12 p-2">Running distance per trip</td>
                                <td className=" w-10/12 p-2">: {dataVisit?.distancePerTrip} km</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className=" w-3/12 p-2">Route of trip</td>
                                <td className=" w-10/12 p-2">: {dataVisit?.routeOfTrip}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Road Condition */}
            <div>
                <div className="flex">
                    <table className="w-full border mt-8">
                        <thead>
                            <tr className="">
                                <td className="font-semibold p-3 border bg-slate-50" colSpan={2}>Road Condition</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="flex">
                                <table className="w-4/12 border-r">
                                    <thead>
                                        <tr className="">
                                            <td className="font-semibold p-3 bg-slate-50 text-center border-b" colSpan={2}>Percentage of Highway(%)</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="text-left w-full">
                                            <td className=" w-8/12 border-b p-2">Highway</td>
                                            <td className="border-l border-b w-4/12 p-2 text-center">{dataVisit?.highway}</td>
                                        </tr>
                                        <tr className="text-left w-full">
                                            <td className=" w-8/12 border-b p-2">City Road</td>
                                            <td className="border-l border-b w-4/12 p-2 text-center">{dataVisit?.cityRoad}</td>
                                        </tr>
                                        <tr className="text-left w-full">
                                            <td className=" w-8/12 p-2">Country Road</td>
                                            <td className="border-l w-4/12 p-2 text-center">{dataVisit?.countryRoad}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="w-4/12 border-r">
                                    <thead>
                                        <tr className="">
                                            <td className="font-semibold p-3 bg-slate-50 text-center border-b" colSpan={2}>Route of Surface(%)</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="text-left w-full">
                                            <td className=" w-8/12 border-b p-2">On Road</td>
                                            <td className="border-l border-b w-4/12 p-2 text-center">{dataVisit?.onRoad}</td>
                                        </tr>
                                        <tr className="text-left w-full">
                                            <td className=" w-8/12 p-2">Off Road</td>
                                            <td className="border-l w-4/12 p-2 text-center">{dataVisit?.offRoad}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="w-4/12">
                                    <thead>
                                        <tr className="">
                                            <td className="font-semibold p-3 bg-slate-50 text-center border-b" colSpan={2}>Percentage of Mountain Route(%)</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="text-left w-full">
                                            <td className=" w-8/12 border-b p-2">Flat Road</td>
                                            <td className="border-l border-b w-4/12 p-2 text-center">{dataVisit?.flatRoad}</td>
                                        </tr>
                                        <tr className="text-left w-full">
                                            <td className=" w-8/12 p-2">Climb Road</td>
                                            <td className="border-l w-4/12 p-2 text-center">{dataVisit?.climbRoad}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <table className="w-full border border-t-0">
                <tbody>
                    <tr className="text-left w-full">
                        <td className="border- border-br w-3/12 p-2">Maximum Slope</td>
                        <td className="w-9/12 p-2">: {dataVisit?.maximumSlope} %</td>
                    </tr>
                    <tr className="text-left w-full">
                        <td className="border- border-br w-3/12 p-2">Loading Ratio</td>
                        <td className="w-9/12 p-2">: {dataVisit?.loadingRatio} %</td>
                    </tr>

                </tbody>
            </table>

            {/* Customer Voice */}
            <div>
                <div className="flex">
                    <table className="w-full border mt-8">
                        <thead>
                            <tr className="">
                                <td className="font-semibold p-3 border bg-slate-50" colSpan={2}>Customer Voice</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-left w-full">
                                <td className="border- border-br w-3/12 p-2">Expected Usage Years</td>
                                <td className="w-9/12 p-2">: {dataVisit?.yearsOfUse} years</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className="border- border-br w-3/12 p-2">Reason of Purchase</td>
                                <td className="w-9/12 p-2">: {renderTextBlocks(dataVisit?.reasonOfPurchase)}</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className="border- border-br w-3/12 p-2">Customer Info</td>
                                <td className="w-9/12 p-2">: {renderTextBlocks(dataVisit?.customerInfo)}</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className="border- border-br w-3/12 p-2">Service Info</td>
                                <td className="w-9/12 p-2">: {renderTextBlocks(dataVisit?.serviceInfo)}</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className="border- border-br w-3/12 p-2">Spare Parts Info</td>
                                <td className="w-9/12 p-2">: {renderTextBlocks(dataVisit?.sparepartInfo)}</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className="border- border-br w-3/12 p-2">Technical Info</td>
                                <td className="w-9/12 p-2">: {renderTextBlocks(dataVisit?.technicalInfo)}</td>
                            </tr>
                            <tr className="text-left w-full">
                                <td className="border- border-br w-3/12 p-2">Competitor Info</td>
                                <td className="w-9/12 p-2">: {renderTextBlocks(dataVisit?.competitorInfo)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Attachment */}
            <div className="mt-8">
                <h2 className="font-semibold text-sm">*Content Of Investigation Attachment</h2>
                <div className="grid grid-cols-4 gap-4 mt-4">
                    {dataVisit?.attachments?.map((row, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 flex flex-col items-center cursor-pointer"
                            onClick={() => window.open(row.imageAttached, "_blank")}
                        >
                            <img
                                src={row.imageAttached}
                                alt="Unit Involve"
                                className="w-full h-60 object-cover"
                            />
                            <div className="bg-gray-300 text-center font-bold p-2 w-full">
                                {row.imageDescription}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default VisitViewer