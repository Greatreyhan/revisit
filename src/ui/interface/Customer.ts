import { MapMarkerData } from "./MapSelector";

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

export interface CustomerData {
  customerId?: string;
  userId?: string;

  // Basic Information
  customerName: string;
  dealer: string;
  dateOperation: string;
  area: string;
  location: string;
  dataLocation: string[];
  city: string;
  email: string;         // ditambahkan sesuai update object
  phone: string;         // ditambahkan sesuai update object
  segment: string;
  typeCustomer: string;  // ditambahkan sesuai update object

  // Operational Information
  dayPerWeek: string;
  tripPerDay: string;
  distancePerTrip: string;
  routeOfTrip: string;
  mapAttached: string;
  mapMarkers: MapMarkerData[];
  mapDistance: number;
  locationMap: MapMarkerData;

  // Unit Information
  units: UnitVisit[];
  unitInvolves: UnitInvolve[];
}
