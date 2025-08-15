import { api } from "./api";

export const loginApi = async (data: any) => {
    const res = await api().post('/auth/login', data);
    return res.data;
}

export const updateUserPassword = async (password: string) => {
    const res = await api().patch('/users/update-password', {password});
    return res.data;
}