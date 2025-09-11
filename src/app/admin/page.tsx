import Dashboard from "@/components/admin/Dashboard";
import { LeaveRequest } from "@/types/leaveRequest";
import axios from "axios";
import { cookies } from "next/headers";

export default async function UserPage() {
  const res = await axios
    .create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
      },
    })
    .get("/leave-request/admin/get")
    .catch((error) => console.log(error));

  const data = res?.data?.data || [];
  const userCookie = (await cookies()).get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  const leaveRequests: LeaveRequest[] = data.map(
    (item: any) => ({ ...item, user: item.User })
  );

  return <Dashboard leaveRequests={leaveRequests} user={user}></Dashboard>;
}
