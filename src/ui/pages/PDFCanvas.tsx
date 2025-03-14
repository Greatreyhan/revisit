import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image, PDFDownloadLink } from "@react-pdf/renderer";
import { Logo2 } from "../../assets/images";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import { ReportData } from "../interface/Report";

const styles = StyleSheet.create({
    page: { padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 },
    logo: { width: 80 },
    textSmall: { fontSize: 10 },
    hr: { borderBottomWidth: 1, marginVertical: 2 },
    section: { marginTop: 10 },
    row: { flexDirection: 'row' },
    column: { flex: 1, borderWidth: 1, textAlign: 'center', margin: 2, padding: 4 },
    boldText: { fontSize: 10, fontWeight: 'bold' },
    normalText: { fontSize: 10 },
    title: { fontSize: 14, fontWeight: 'bold', marginVertical: 4 },
    textCenter: { textAlign: 'center' },

    general_container: {
        flexDirection: 'row',
        marginTop: 16,
    },
    general_fullWidth: {
        flex: 1,
    },
    general_title: {
        fontSize: 8,
        fontWeight: 'semibold',
    },
    general_description: {
        fontSize: 12,
        padding: 4,
        marginTop: 8,
    },
    general_section: {
        width: '16.66%',
        padding: 4,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    general_sectionTitle: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    general_sectionText: {
        fontSize: 12,
        marginTop: 5
    },
    basic_sectionTitle: {
        fontSize: 8,
        fontWeight: 'semibold',
        marginTop: 16,
    },
    basic_container: {
        flexDirection: 'row',
    },
    basic_box: {
        width: '19%',
        margin: 4,
        borderWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
    },
    basic_header: {
        fontSize: 8,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderColor: '#000',
        padding: 4,
    },
    basic_text: {
        fontSize: 9,
        padding: 4,
    },
    cust_page: { padding: 20 },
    cust_section: { marginBottom: 10, display: 'flex', flexDirection: 'row' },
    cust_title: { fontSize: 8, fontWeight: 'bold', marginBottom: 5, marginTop: 16 },
    cust_table: { display: 'flex', width: '75%', borderStyle: 'solid', borderWidth: 1 },
    cust_table2: { display: 'flex', width: '25%', borderStyle: 'solid', borderWidth: 1 },
    cust_tableRow: { flexDirection: 'row', alignItems: "flex-start", },
    cust_tableCell: { borderWidth: 1, width: '100%', height: '100%', padding: 5, fontSize: 8, textAlign: 'center', flex: 1 },
    cust_tableHeader: { fontWeight: 'bold', backgroundColor: '#f0f0f0' },
    problem_page: { padding: 20 },
    problem_section: { marginBottom: 10 },
    problem_title: { fontSize: 8, fontWeight: "bold", marginBottom: 5 },
    problem_table: { display: "flex", flexDirection: "column", border: "1px solid #000" },
    problem_row: { flexDirection: "row" },
    problem_cell: { flex: 1, border: "1px solid #000", padding: 5, fontSize: 10 },
    problem_header: { backgroundColor: "#E5E7EB", fontWeight: "bold" },
    problem_textCenter: { textAlign: "center" },
    content_page: { padding: 20 },
    content_title: { fontSize: 8, fontWeight: 'bold', marginBottom: 10 },
    content_table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#444' },
    content_tableRow: { flexDirection: 'row' },
    content_tableColHeader: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderColor: '#444', backgroundColor: '#DDD', padding: 5, textAlign: 'center', fontWeight: 'bold' },
    content_tableCol: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderColor: '#444', padding: 5 },
    content_textCenter: { textAlign: 'center' },
    content_textRed: { color: 'red', fontWeight: 'bold', textDecoration: 'underline' },
    content_textGreen: { color: 'green', fontWeight: 'bold' }
});


const PDFCanvas = () => {
    const { getFromDatabase } = useFirebase()
    const { id } = useParams<{ id: string }>();

    // Context
    const [dataReport, setDataReport] = useState<ReportData>()

    useEffect(() => {
        if (id) {
            getFromDatabase(`report/${id}`).then((data) => {
                if (data) {
                    setDataReport(data);
                }
            });
        }
    }, [id]);
    return (
        <div className="py-8 px-16">
            {/* Menampilkan PDF dalam browser */}
            <PDFViewer style={{ width: "100%", height: "900px" }}>
                <Document>
                    <Page size="A4" style={styles.page}>
                        <View style={styles.header}>
                            <Image src={Logo2} style={styles.logo} />
                            <View>
                                <Text style={styles.textSmall}>No. Form : 12345</Text>
                                <Text style={styles.textSmall}>Div/Dept : TWF</Text>
                                <Text style={styles.textSmall}>Rev. : 2</Text>
                            </View>
                        </View>
                        <View style={styles.hr} />
                        <View style={styles.hr} />

                        <View style={styles.general_container}>
                            <View style={styles.general_fullWidth}>
                                <Text style={styles.general_title}>*Title/Judul</Text>
                                <Text style={styles.general_description}>
                                    {`${dataReport?.largeClassification || ''} ${dataReport?.middleClassification || ''} ${dataReport?.partProblem || ''} ${dataReport?.focusModel || ''} ${dataReport?.euroType || ''}`}
                                </Text>
                            </View>
                            <View style={styles.general_section}>
                                <Text style={styles.general_sectionTitle}>Created</Text>
                                <Text style={styles.general_sectionText}>{dataReport?.visitor}</Text>
                            </View>
                            <View style={styles.general_section}>
                                <Text style={styles.general_sectionTitle}>Reviewed</Text>
                                <Text style={styles.general_sectionText}>{dataReport?.reviewer}</Text>
                            </View>
                            <View style={styles.general_section}>
                                <Text style={styles.general_sectionTitle}>Approved</Text>
                                <Text style={styles.general_sectionText}>{dataReport?.approval}</Text>
                            </View>
                        </View>

                        <View>
                            <Text style={styles.basic_sectionTitle}>*Basic Information</Text>
                            <View style={styles.basic_container}>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Customer Name</Text>
                                    <Text style={styles.basic_text}>{dataReport?.customerName}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Dealer</Text>
                                    <Text style={styles.basic_text}>{dataReport?.dealer}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Where Location</Text>
                                    <Text style={styles.basic_text}>{dataReport?.location}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Unit Type</Text>
                                    <Text style={styles.basic_text}>{dataReport?.vehicleType}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>EG Number</Text>
                                    <Text style={styles.basic_text}>{dataReport?.EGN}</Text>
                                </View>
                            </View>
                            <View style={styles.basic_container}>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>VIN No.</Text>
                                    <Text style={styles.basic_text}>{dataReport?.VIN}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Production Date</Text>
                                    <Text style={styles.basic_text}>{dataReport?.productionDate}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Mileage (KM)</Text>
                                    <Text style={styles.basic_text}>{dataReport?.mileage}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Karoseri</Text>
                                    <Text style={styles.basic_text}>{dataReport?.karoseri}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Payload (KG)</Text>
                                    <Text style={styles.basic_text}>{dataReport?.payload}</Text>
                                </View>
                            </View>
                            <View style={styles.basic_container}>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Rear Body Type</Text>
                                    <Text style={styles.basic_text}>{dataReport?.application}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Industrial Segment</Text>
                                    <Text style={styles.basic_text}>{dataReport?.segment}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Loading Type</Text>
                                    <Text style={styles.basic_text}>{dataReport?.loading}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Problem: {dataReport?.problemDate}</Text>
                                    <Text style={styles.basic_text}>Visit: {dataReport?.visitDate}</Text>
                                </View>
                                <View style={styles.basic_box}>
                                    <Text style={styles.basic_header}>Status</Text>
                                    <Text style={styles.basic_text}>{dataReport?.status}</Text>
                                </View>
                            </View>
                        </View>
                        {/* Customer */}
                        <Text style={styles.cust_title}>*Customer Information</Text>
                        <View style={styles.cust_section}>

                            {/* Table 1 */}
                            <View style={styles.cust_table}>
                                <View style={[styles.cust_tableRow, styles.cust_tableHeader]}>
                                    <Text style={styles.cust_tableCell}>Merk</Text>
                                    <Text style={styles.cust_tableCell}>Type Unit</Text>
                                    <Text style={styles.cust_tableCell}>Qty (Units)</Text>
                                    <Text style={styles.cust_tableCell}>Goods</Text>
                                    <Text style={styles.cust_tableCell}>Route</Text>
                                    <Text style={styles.cust_tableCell}>Distance</Text>
                                </View>
                                {dataReport?.units.map((unit, index) => (
                                    <View key={index} style={styles.cust_tableRow}>
                                        <Text style={styles.cust_tableCell}>{unit?.trademark}</Text>
                                        <Text style={styles.cust_tableCell}>{unit?.typeUnit}</Text>
                                        <Text style={styles.cust_tableCell}>{unit?.qtyUnit}</Text>
                                        <Text style={styles.cust_tableCell}>{unit?.goodType}</Text>
                                        <Text style={styles.cust_tableCell}>{unit?.route}</Text>
                                        <Text style={styles.cust_tableCell}>{unit?.distance}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Table 2 */}
                            <View style={styles.cust_table2}>
                                <View style={[styles.cust_tableRow, styles.cust_tableHeader]}>
                                    <Text style={styles.cust_tableCell} colSpan={2}>Road Condition (%)</Text>
                                </View>
                                {[
                                    ['Highway', dataReport?.highway],
                                    ['City Road', dataReport?.cityRoad],
                                    ['Country Road', dataReport?.countryRoad],
                                    ['On Road', dataReport?.onRoad],
                                    ['Off Road', dataReport?.offRoad],
                                    ['Flat Road', dataReport?.flatRoad],
                                    ['Climb Road', dataReport?.climbRoad],
                                ].map(([label, value], index) => (
                                    <View key={index} style={styles.cust_tableRow}>
                                        <Text style={styles.cust_tableCell}>{label}</Text>
                                        <Text style={styles.cust_tableCell}>{value}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Problem Background */}
                        <View style={styles.problem_section}>
                            <Text style={styles.problem_title}>*Problem Background</Text>

                            {/* Unit Involve */}
                            <View style={[styles.problem_table, { marginBottom: 10 }]}>
                                <View style={[styles.problem_row, styles.problem_header]}>
                                    <Text style={[styles.problem_cell, styles.problem_textCenter]} colSpan={2}>Unit Involve</Text>
                                </View>
                                <View style={[styles.problem_row, styles.problem_header]}>
                                    <Text style={[styles.problem_cell, styles.problem_textCenter]}>VIN</Text>
                                    <Text style={[styles.problem_cell, styles.problem_textCenter]}>Mileage</Text>
                                </View>
                                {dataReport?.unitInvolves?.map((row, index) => (
                                    <View style={styles.problem_row} key={index}>
                                        <Text style={[styles.problem_cell, styles.problem_textCenter]}>{row?.VIN}</Text>
                                        <Text style={[styles.problem_cell, styles.problem_textCenter]}>{row?.mileage}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* 1. Phenomenon */}
                            <View style={styles.problem_table}>
                                <View style={[styles.problem_row, styles.problem_header]}>
                                    <Text style={[styles.problem_cell]}>1. Phenomenon</Text>
                                </View>
                                <View style={styles.problem_row}>
                                    <Text style={styles.problem_cell}>{dataReport?.phenomenon}</Text>
                                </View>
                            </View>

                        </View>

                        {/* 2. History Maintenance */}
                        <View style={styles.problem_section}>
                            <View style={styles.problem_table}>
                                <View style={[styles.problem_row, styles.problem_header]}>
                                    <Text style={[styles.problem_cell]}>2. History Maintenance</Text>
                                </View>
                                <View style={styles.problem_row}>
                                    <Text style={styles.problem_cell}>{dataReport?.historyMaintenance}</Text>
                                </View>
                            </View>
                        </View>

                        {/* 3. FA Result Temporary Investigation */}
                        <View style={styles.problem_section}>
                            <View style={styles.problem_table}>
                                <View style={[styles.problem_row, styles.problem_header]}>
                                    <Text style={[styles.problem_cell]}>3. FA Result Temporary Investigation</Text>
                                </View>
                                <View style={styles.problem_row}>
                                    <Text style={styles.problem_cell}>{dataReport?.FATemporaryInvestigation}</Text>
                                </View>
                            </View>
                        </View>

                        {/* content */}
                        <Text style={styles.content_title}>*Contents of Investigation</Text>
                        <View style={styles.content_table}>
                            <View style={styles.content_tableRow}>
                                <Text style={styles.content_tableColHeader}>#</Text>
                                <Text style={styles.content_tableColHeader}>Contents</Text>
                                <Text style={styles.content_tableColHeader}>Result</Text>
                                <Text style={styles.content_tableColHeader}>Standard</Text>
                                <Text style={styles.content_tableColHeader}>Judge</Text>
                            </View>
                            {dataReport?.investigations.map((row, index) => (
                                <View key={index} style={styles.content_tableRow}>
                                    <Text style={[styles.content_tableCol, styles.content_textCenter]}>{index + 1}</Text>
                                    <Text style={styles.content_tableCol}>{row.content}</Text>
                                    <Text style={styles.content_tableCol}>{row.result}</Text>
                                    <Text style={styles.content_tableCol}>{row.standard}</Text>
                                    <Text style={[styles.content_tableCol, styles.content_textCenter, row.judge === 'NG' ? styles.textRed : row.judge === 'OK' ? styles.textGreen : {}]}>
                                        {row.judge}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </Page>
                </Document>
            </PDFViewer>

            {/* Tombol untuk mengunduh PDF */}
            {/* <PDFDownloadLink document={<InvestigationReport dataReport={dataReport} />} fileName="Laporan.pdf">
                {({ loading }) => (loading ? "Mengunduh..." : <button>Unduh PDF</button>)}
            </PDFDownloadLink> */}
        </div>
    );
};

export default PDFCanvas;
