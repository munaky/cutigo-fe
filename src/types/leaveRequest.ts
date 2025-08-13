import { User } from "./user";

export interface LeaveRequest {
    id: number;
    userId: number | null;
    user: User | null;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
}