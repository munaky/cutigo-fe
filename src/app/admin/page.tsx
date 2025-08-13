"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LeaveRequest } from "@/types/leaveRequest";
import FullScreenLoader from "@/components/FullScreenLoader";
import { getUser, logout } from "@/utils/auth";
import { LogOut } from "lucide-react";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { getLeaveRequestApi } from "@/api/admin";
import LeaveRequestAdminCard from "@/components/LeaveRequestAdminCard";

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    setUser(getUser());
    setLoading(true);
    getLeaveRequestApi()
      .then((r) => {
        const data: any = r.data;
        const newRecords: LeaveRequest[] = data.map((item: any) => ({
          ...item,
          user: item.User,
        }));
        const pendingRecord = newRecords.filter((r) => r.status == "PENDING");
        const nonPendingRecord = newRecords.filter(
          (r) => r.status != "PENDING"
        );

        setRecords([...pendingRecord, ...nonPendingRecord]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <FullScreenLoader loading={loading} />
      <div className="px-6 pb-6 space-y-4">
        <div className="flex justify-between items-center mt-4 pb-4 border-b-2 border-indigo-100">
          <div className="flex flex-row items-center px-3 rounded-full bg-indigo-100">
            <h1 className="text-xl font-bold text-gray-500">{user?.name || 'Loading...'}</h1>
            <LogOut
              onClick={handleLogout}
              size={20}
              className="ml-4 cursor-pointer text-red-500"
            ></LogOut>
          </div>
          <div className="flex gap-4">
            <div 
            className="flex items-center rounded-full px-2 py-1 border-2 bg-indigo-300 border-indigo-400">
              <p className="font-semibold text-indigo-600">Requests</p>
            </div>
            <div
            onClick={() => router.push('/admin/users')}
            className="flex items-center rounded-full px-2 py-1 border bg-indigo-200 border-indigo-300">
              <p className="font-semibold text-indigo-500">Users</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-row justify-center md:justify-start flex-wrap gap-3">
            {records.map((r) => (
              <LeaveRequestAdminCard
                key={r.id}
                record={r}
                setRecords={setRecords}
              />
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
