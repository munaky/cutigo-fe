import Dashboard from "@/components/user/Dashboard";
import axios from "axios";
import { cookies } from "next/headers";

export default async function UserPage() {
  const res = await axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await cookies()).get('token')?.value}`,
    },
  }).get('/leave-request/user/get').catch(error => console.log(error))

  const data = res?.data?.data || [];
  const userCookie = (await cookies()).get('user')?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  return <Dashboard leaveRequests={data} user={user}></Dashboard>;
}
