"use client";

import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LeaveRequest } from "@/types/leaveRequest";
import { createLeaveRequestApi, getLeaveRequestApi } from "@/api/user";
import Dialog from "@/components/Dialog";
import FullScreenLoader from "@/components/FullScreenLoader";
import { getUser, logout } from "@/utils/auth";
import LeaveRequestUserCard from "@/components/LeaveRequestUserCard";
import { LogOut } from "lucide-react";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();
  const startDateRef = useRef<HTMLInputElement | null>(null)
  const today = new Date().toISOString().split("T")[0];
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<LeaveRequest[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
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
    e.preventDefault();
    setLoading(true);

    await createLeaveRequestApi(formData)
      .then((r) => {
        const newRecord: LeaveRequest = r.data;
        setRecords((prev) => [newRecord, ...prev]);
        setFormData({
          startDate: "",
          endDate: "",
          reason: "",
        });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setOpen(false);
        setLoading(false);
      });
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    setUser(getUser());
    setLoading(true);
    getLeaveRequestApi()
      .then((r) => {
        const data: LeaveRequest[] = r.data;

        setRecords(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={["USER"]}>
      <FullScreenLoader loading={loading} />
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
          <div className="flex flex-row items-center px-3 rounded-full bg-indigo-100">
            <h1 className="text-xl font-bold text-gray-500">{user?.name || 'Loading...'}</h1>
            <LogOut
              onClick={handleLogout}
              size={20}
              className="ml-4 cursor-pointer text-red-500"
            ></LogOut>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-row justify-center md:justify-start flex-wrap gap-3">
            {records.map((r) => (
              <LeaveRequestUserCard
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
