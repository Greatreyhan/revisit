import { AttachmentItem } from "./Report";

export interface TraineePerson {
    name: string;
    position: string;
    age: number;
    phone: string;
    email: string;
    score: number;
}

export interface TraineeData {
    trainerName: string;
    dealer: string;
    customerName: string;
    startDate: string;
    endDate: string;
    title: string;
    description: string;
    unit: string[];
    trainee: TraineePerson[];  
    attachments: AttachmentItem[];
  }
  