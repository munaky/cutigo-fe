export interface User {
    id: number;
    name: string;
    email: string;
    leaveRequestCount: number;
    role: 'ADMIN' | 'USER';
}