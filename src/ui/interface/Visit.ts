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

export interface UnitVisit {
    trademark: string;
    typeUnit: string;
    qtyUnit: string;
    rearBodyType: string;
    payload: string;
    goods: string;
    bodyMaker: string;
}

export interface UnitInvolve {
    VIN: string;
    mileage: string;
}

export interface VisitData {
    reportId?: string;
    userId?: string;

    // Context
    context: string;
    
    // General Information
    formNumber: string;
    visitorName: string;
    visitDate: string;
    visitor: string;
    reviewer: string;
    approval: string;
    
    // Basic Information
    customerName: string;
    dealer: string;
    dateOperation: string;
    area: string;
    dataLocation: string[];
    location: string;
    city: string;
    segment: string;
    // application: string;
    // loadingUnit: string;
    
    // Operational
    dayPerWeek: string;
    tripPerDay: string;
    distancePerTrip: string;
    routeOfTrip: string;
    mapAttached: string;
    
    // Road Condition
    highway: string;
    cityRoad: string;
    countryRoad: string;
    onRoad: string;
    offRoad: string;
    flatRoad: string;
    climbRoad: string;
    maximumSlope: string;
    loadingRatio: string;
    yearsOfUse: string;
    
    // Customer Voice
    reasonOfPurchase: string;
    customerInfo: string;
    serviceInfo: string;
    sparepartInfo: string;
    technicalInfo: string;
    competitorInfo: string;
    
    // Additional Information
    attachments: AttachmentItem[];
    investigations: InvestigationItem[];
    units: UnitVisit[];
    unitInvolves: UnitInvolve[];
}
