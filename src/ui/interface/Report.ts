export interface AttachmentItem {
    imageAttached: string;
    imageDescription: string;
}

export interface InvestigationItem {
    content: string;
    result: string;
    standard: string;
    judge: string;
}

export interface Unit {
    trademark: string;
    typeUnit: string;
    qtyUnit: string;
    goodType: string;
    route: string;
    distance: string;
}

export interface UnitInvolve {
    VIN: string;
    mileage: string;
}

export interface ReportData {
    userId? : string;
    reportId? : string;
    context: string;
    largeClassification: string;
    dataMiddleClassification: string[];
    middleClassification: string;
    partProblem: string;
    visitor: string;
    reviewer: string;
    approval: string;
    customerName: string;
    area: string;
    dataLocation: string[];
    location: string;
    city: string;
    dealer: string;
    series: string;
    vehicleType: string;
    focusModel: string;
    euroType: string;
    VIN: string;
    EGN: string;
    productionDate: string;
    payload: string;
    mileage: string;
    karoseri: string;
    segment: string;
    application: string;
    loadingUnit: string;
    problemDate: string;
    visitDate: string;
    status: string;
    highway: string;
    cityRoad: string;
    countryRoad: string;
    onRoad: string;
    offRoad: string;
    flatRoad: string;
    climbRoad: string;
    phenomenon: string;
    historyMaintenance: string;
    FATemporaryInvestigation: string;
    investigationResult: string;
    customerVoice: string;
    temporaryAction: string;
    homework: string;
    otherCaseTIR: string;
    difficultPoint: string;
    attachments: AttachmentItem[];
    investigations: InvestigationItem[];
    units: Unit[];
    unitInvolves: UnitInvolve[];
  }