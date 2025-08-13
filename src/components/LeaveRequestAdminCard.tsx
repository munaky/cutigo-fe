import React, { useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { LeaveRequest } from "@/types/leaveRequest";
import { deleteLeaveRequestApi, updateLeaveRequestApi } from "@/api/admin";
import { formatDate } from "@/utils/formatDate";
import Dialog from "./Dialog";

interface LeaveRequestProps {
  record: LeaveRequest;
  setRecords: (data: any) => void;
}

export default function LeaveRequestAdminCard({
  record,
  setRecords,
}: LeaveRequestProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<
    string | "PENDING" | "APPROVED" | "REJECTED"
  >(record.status);

  function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    deleteLeaveRequestApi(record.id).catch((err: any) => console.log(err));

    setRecords((prev: LeaveRequest[]) =>
      prev.filter((r) => r.id !== record.id)
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setRecords((prev: LeaveRequest[]) => {
      const newRecords = prev.map((r) =>
        r.id == record.id ? { ...r, status } : r
      );
      const pendingRecord = newRecords.filter((r) => r.status == "PENDING");
      const nonPendingRecord = newRecords.filter((r) => r.status != "PENDING");

      return [...pendingRecord, ...nonPendingRecord];
    });

    updateLeaveRequestApi(record.id, status as any);

    setOpen(false);
  };
  return (
    <div
      className={
        "max-w-xs w-xs rounded-lg border-2 bg-white p-4 shadow-lg " +
        (record.status == "PENDING"
          ? "border-blue-300"
          : record.status == "APPROVED"
          ? "border-green-300"
          : "border-red-300")
      }
    >
      {/* Update dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              onChange={(e) => setStatus(e.target.value)}
              value={status}
              name="status"
              id="status"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <form
          onSubmit={(e) => handleDelete(e)}
          className="flex flex-col gap-6 min-w-[300px]"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Delete this request?
          </h2>
          <p className="text-sm text-gray-600">
            This action cannot be undone. The request data will be permanently
            removed from the database.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpenDeleteDialog(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
            >
              Delete
            </button>
          </div>
        </form>
      </Dialog>
      {/* Employee Name */}
      <p className="font-semibold text-center text-gray-600">
        {record.user?.name}
      </p>

      {/* Status */}
      <p
        className={
          "text-center text-lg font-bold " +
          (record.status == "PENDING"
            ? "text-blue-500"
            : record.status == "APPROVED"
            ? "text-green-500"
            : "text-red-500")
        }
      >
        {record.status}
      </p>

      {/* Date range */}
      <p className="mt-1 text-center font-semibold text-gray-800">
        {formatDate(record.startDate)} ~ {formatDate(record.endDate)}
      </p>

      {/* Reason */}
      <div className="border-t-1 border-gray-200 mt-2 mb-2"></div>
      <p className="h-[6ch] max-h-[6ch] overflow-y-auto break-all text-center italic text-gray-500 leading-snug">
        &quot;{record.reason}&quot;
      </p>

      {/* Bottom section */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {formatDate(record.createdAt)}
        </span>
        <div className="flex gap-2">
          <div
            onClick={() => setOpen(true)}
            className="p-1 rounded-lg cursor-pointer bg-green-500 hover:bg-green-600"
          >
            <SquarePen size={16} className="text-white" />
          </div>
          <div
            onClick={() => setOpenDeleteDialog(true)}
            className="p-1 rounded-lg cursor-pointer bg-red-500 hover:bg-red-600"
          >
            <Trash2 size={16} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
