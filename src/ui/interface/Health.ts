export interface HealthReportData {
  healthId?: string;
  userId?: string;
  customerName: string;
  dealer: string;
  downloadDate: string; // Format ISO DateTime
  explainDate: string;  // Format ISO DateTime
  fuelConsumption: string;
  goodType: string;
  payload: string;
  rearBodyType: string;
  segment: string;
  typeUnit: string;
}