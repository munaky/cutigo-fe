"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LeaveRequest } from "@/types/leaveRequest";
import { useRouter } from "next/navigation";
import LeaveRequestAdminCard from "@/components/LeaveRequestAdminCard";
import Profile from "@/components/Profile";
import Toast from "@/components/Toast";
import { User } from "@/types/user";
import FullScreenLoader from "../FullScreenLoader";

interface DashboardProps {
    leaveRequests: LeaveRequest[];
    user: User;
}

export default function Dashboard({leaveRequests, user} : DashboardProps) {
  const router = useRouter();
  const [records, setRecords] = useState<LeaveRequest[]>(leaveRequests);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <FullScreenLoader loading={loading} />
      {error && (
        <Toast
          type={"error"}
          title={"Error!"}
          message={error}
          onClose={() => setError("")}
        />
      )}
      <div className="px-6 pb-6 space-y-4">
        <div className="flex justify-between items-center mt-4 pb-4 border-b-2 border-indigo-100">
          <Profile user={user} />
          <div className="flex gap-4">
            <div className="flex items-center rounded-full px-2 py-1 border-2 cursor-pointer bg-indigo-300 border-indigo-400">
              <p className="font-semibold text-indigo-600">Requests</p>
            </div>
            <div
              onClick={() => {
                setLoading(true);
                router.push("/admin/users");
              }}
              className="flex items-center rounded-full px-2 py-1 border cursor-pointer bg-indigo-200 border-indigo-300"
            >
              <p className="font-semibold text-indigo-500">Users</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center flex-wrap gap-3">
          {records.map((r) => (
            <LeaveRequestAdminCard
              key={r.id}
              record={r}
              setRecords={setRecords}
            />
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
