import Users from "@/components/admin/Users";
import axios from "axios";
import { cookies } from "next/headers";

export default async function UserPage() {
  const res = await axios.create({
    baseURL: process.env.INTERNAL_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await cookies()).get('token')?.value}`,
    },
  }).get('/users/get').catch(error => console.log(error))

  const data = res?.data?.data || [];
  const userCookie = (await cookies()).get('user')?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  return <Users listUser={data} user={user}></Users>;
}
