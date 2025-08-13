import { api } from "./api";

export const getUsersApi = async () => {
    const res = await api().get('/users/get')
    return res.data;
}

export const createUsersApi = async (data: object) => {
    const res = await api().post('/users/create', data)
    return res.data;
}

export const updateUsersApi = async (id: number, data: object) => {
    const res = await api().patch(`/users/update/${id}`, data)
    return res.data;
}

export const deleteUsersApi = async (id: number) => {
    const res = await api().delete(`/users/delete/${id}`)
    return res.data;
}

export const getLeaveRequestApi = async () => {
    const res = await api().get('/leave-request/admin/get')
    return res.data;
}

export const updateLeaveRequestApi = async (id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    const res = await api().patch(`/leave-request/admin/update/${id}`, {status});
    return res.data;
}

export const deleteLeaveRequestApi = async (id: number) => {
    const res = await api().delete(`/leave-request/admin/delete/${id}`)
    return res.data;
}