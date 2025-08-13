import { api } from "./api";

export const getLeaveRequestApi = async () => {
    const res = await api().get('/leave-request/user/get')
    return res.data;
}

export const createLeaveRequestApi = async (data: any) => {
    const res = await api().post('/leave-request/user/create', data)
    return res.data;
}

export const deleteLeaveRequestApi = async (leaveReqestId: number) => {
    const res = await api().delete(`/leave-request/user/delete/${leaveReqestId}`)
    return res.data;
}