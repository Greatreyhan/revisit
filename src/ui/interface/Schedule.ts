import { MapMarkerData } from "./MapSelector";

export interface ScheduleData {
    scheduleId? : string;
    userId? : string;
    dealer : string;
    customer: string;
    dateStart: string;
    dateEnd: string;
    status: string;
    address: string;
    type: string;
    description: string;
    mapMarkers: MapMarkerData[];
}
