import { api } from "./api";

export const loginApi = async (data: any) => {
    const res = await api().post('/auth/login', data);
    return res.data;
}