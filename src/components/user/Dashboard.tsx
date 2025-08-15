"use client";

import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LeaveRequest } from "@/types/leaveRequest";
import { createLeaveRequestApi, getLeaveRequestApi } from "@/api/user";
import Dialog from "@/components/Dialog";
import FullScreenLoader from "@/components/FullScreenLoader";
import LeaveRequestUserCard from "@/components/LeaveRequestUserCard";
import Profile from "@/components/Profile";
import Toast from "@/components/Toast";
import { User } from "@/types/user";

interface DashboardProps {
  leaveRequests: LeaveRequest[];
  user: User | null;
}

export default function Dashboard({leaveRequests, user}:DashboardProps) {
  const startDateRef = useRef<HTMLInputElement | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const [records, setRecords] = useState<LeaveRequest[]>(leaveRequests);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);

      const res = await createLeaveRequestApi(formData);
      const newRecord: LeaveRequest = res.data;
      setRecords((prev) => [newRecord, ...prev]);
      setFormData({
        startDate: "",
        endDate: "",
        reason: "",
      });

      setOpen(false);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong, try again later.";

      setOpen(false);
      setLoading(false);
      setError(message);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["USER"]}>
      <FullScreenLoader loading={loading} />
      {error && (
        <Toast
          type={"error"}
          title={"Error!"}
          message={error}
          onClose={() => setError("")}
        />
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              ref={startDateRef}
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={today}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={startDateRef.current?.value}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reason
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
              placeholder="Enter reason..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </Dialog>
      <div className="px-6 pb-6 space-y-4">
        <div className="flex justify-between items-center mt-4 pb-4 border-b-2 border-indigo-100">
          <Profile user={user} />
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>

        <div className="flex flex-row justify-center gap-3 flex-wrap w-full">
          {records.map((r) => (
            <LeaveRequestUserCard
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
